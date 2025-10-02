import argparse
import json
import pathlib

def generate_profile(release_dir,release_target):
    
    overview_file = release_dir.joinpath(".overview.json")
    overview_json = json.loads(overview_file.read_text()) if overview_file.exists() else {}
    targets_file = release_dir.joinpath(".targets.json")
    targets_json = json.loads(targets_file.read_text()) if targets_file.exists() else {}

    profile_file = release_dir.joinpath('targets').joinpath(release_target).joinpath('profiles.json')
    profile_json = json.loads(profile_file.read_text()) if profile_file.exists() else {}
    profile_json["arch_packages"] = targets_json[release_target]
    profile_json["default_packages"] = profile_json.get('default_packages',[])
    profile_json["profiles"] = profile_json.get("profiles",{})

    for t in filter(lambda t: t.get('target') == release_target, overview_json.get('profiles')):
        profile_json.get('profiles')[t.get('id')] = profile_json.get('profiles').get(t.get('id'), { "device_packages": [], "images": [], "titles": t.get('titles') })
    profile_json["target"] = release_target
    profile_json['version_number'] = overview_json['release']

    profile_file.parent.mkdir(parents=True, exist_ok=True)
    profile_file.write_text(json.dumps(profile_json))

if __name__ == '__main__':

    parser = argparse.ArgumentParser()
    parser.add_argument('--artifact-dir', required=True, type=str, help='Path to the artifact directory')
    parser.add_argument('--artifact-rel', required=True)
    parser.add_argument('--artifact-target', required=True)
    args: argparse.Namespace = parser.parse_args()

    artifact_dir = pathlib.Path(args.artifact_dir)

    artifact_release_dir = artifact_dir.joinpath(args.artifact_rel)

    artifact_versions_file = artifact_dir.joinpath(".versions.json")

    versions = []
    for t in sorted(filter(lambda f: f.is_dir(), artifact_dir.joinpath("releases").glob("[0-9]*")), reverse=True, key=lambda x: x.name):
        versions.append(t.name)

    stable_versions = list(filter(lambda v: 'rc' not in v, versions))
    stable_version = stable_versions[0]
    artifact_versions_obj = {
        'stable_version': stable_version,
        'versions_list': stable_versions,
    }

    upcoming_versions = list(filter(lambda v: 'rc' in v, versions))
    if upcoming_versions:
        artifact_versions_obj['upcoming_version'] = upcoming_versions[0]
    artifact_versions_file.write_text(json.dumps(artifact_versions_obj))

    generate_profile(artifact_release_dir,args.artifact_target)