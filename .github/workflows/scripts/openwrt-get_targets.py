import argparse
import json
import pathlib

parser = argparse.ArgumentParser()
parser.add_argument('-t','--targets', nargs="+", default=[])
args: argparse.Namespace = parser.parse_args()

targets = set()
subtargets = []
archs = []

targets_file = pathlib.Path(__file__).joinpath("../../../../.targets.json").resolve()
targets_json = json.loads(targets_file.read_text()) if targets_file.exists() else {}

archs.extend(list(set(targets_json.values())))

config_path = pathlib.Path(__file__).joinpath("../../../../config").resolve()
global_profiles = config_path.joinpath("profiles.json")
config_profiles = [json.loads(t.read_text()) for t in filter(lambda t: t != global_profiles,config_path.rglob("**/*profiles.json"))]

profiles_objs = list([{"target": t} for t in targets_json.keys()])
profiles_objs = profiles_objs if profiles_objs else config_profiles

if args.targets:
    profiles_objs = list(filter(lambda t: t.get('target') in args.targets,profiles_objs))

for p in profiles_objs:
    profile_target = p.get("target")
    target = profile_target.split("/")[0]
    subtarget = profile_target.split("/")[1]
    targets.add(target)
    subtargets.append({"target": target, "subtarget": subtarget,"generate": any(t.get('target') == p.get('target') for t in config_profiles)})

print("targets={0}".format(json.dumps(sorted(targets))))
print("targets_subtargets={0}".format(json.dumps(sorted(subtargets,key=lambda t: f"{t.get('target')}-{t.get('subtarget')}"))))
print("archs={0}".format(json.dumps(archs)))