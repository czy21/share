import argparse
import json
import pathlib

parser = argparse.ArgumentParser()
parser.add_argument('-o', '--origin', default='config')
parser.add_argument('-t', '--target', nargs="+", default=[])
parser.add_argument('--custom', action="store_true")
args: argparse.Namespace = parser.parse_args()

targets = set()
subtargets = []
archs = []

targets_file = pathlib.Path(__file__).joinpath("../../../../.targets.json").resolve()
targets_json = json.loads(targets_file.read_text()) if targets_file.exists() else {}

archs.extend(list(set(targets_json.values())))

target_from = {}

if args.origin == 'config':
    config_path = pathlib.Path(__file__).joinpath("../../../../config").resolve()
    global_profiles = config_path.joinpath("profiles.json")
    target_from = [
        json.loads(t.read_text())
        for t in filter(lambda t: t != global_profiles,config_path.rglob("**/*profiles.json"))
    ]
    target_from = {t.get('target'):t for t in  target_from}

if args.origin == 'target':
    target_path = pathlib.Path(__file__).joinpath("../../../../target/linux").resolve()
    target_from = [
        {"target": target}
        for target in {
            t.parent.relative_to(target_path).as_posix()
            for t in target_path.rglob("**/*.device.patch")
        }
    ]
    target_from = {t.get('target'):t for t in  target_from}

target_dict = target_from

if args.target:
    if targets_json:
        target_dict = {t: {} for t in targets_json}

    if "all" not in args.target:
        target_dict = {
            k: v
            for k, v in target_dict.items()
            if k in args.target
        }

for k,v in target_dict.items():
    target, subtarget = k.split("/", 1)
    targets.add(target)
    subtargets.append({"target": target, "subtarget": subtarget, "generate": k in target_from})

print("targets={0}".format(json.dumps(sorted(targets))))
print("targets_subtargets={0}".format(json.dumps(sorted(subtargets,key=lambda t: f"{t.get('target')}-{t.get('subtarget')}"))))
print("archs={0}".format(json.dumps(archs)))