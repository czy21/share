import argparse
import json
import pathlib

parser = argparse.ArgumentParser()
parser.add_argument('-t','--targets', nargs="+", default=[])
args: argparse.Namespace = parser.parse_args()

targets = set()
subtargets = []
archs = []

# overview_path = pathlib.Path(__file__).joinpath("../../../../overview.json").resolve()
# profiles_objs = json.loads(overview_path.read_text()).get('profiles') if overview_path.exists() else []
profiles_objs = []
packages_path = pathlib.Path(__file__).joinpath("../../../../packages.json").resolve()
packages_objs = json.loads(packages_path.read_text()) if packages_path.exists() else []

archs.extend([p['name'] for p in packages_objs if p['type'] == 'directory'])

config_path = pathlib.Path(__file__).joinpath("../../../../config").resolve()
global_profiles = config_path.joinpath("profiles.json")
config_profiles = [json.loads(t.read_text()) for t in filter(lambda t: t != global_profiles,config_path.rglob("**/*profiles.json"))]

profiles_objs = list({t.get('target'): {"target": t.get('target')} for t in profiles_objs}.values())
profiles_objs = profiles_objs if profiles_objs else config_profiles

if args.targets:
    profiles_objs = list(filter(lambda t: t.get('target') in args.targets,profiles_objs))

for p in profiles_objs:
    profile_target = p.get("target")
    target = profile_target.split("/")[0]
    subtarget = profile_target.split("/")[1]
    targets.add(target)
    subtargets.append({"target": target, "subtarget": subtarget})

print("targets={0}".format(json.dumps(list(targets))))
print("targets_subtargets={0}".format(json.dumps(subtargets)))
print("archs={0}".format(json.dumps(archs)))
