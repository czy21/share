import argparse
import json
import pathlib

def generate_profile(release_dir, release_target):

    upstream_overview_file = pathlib.Path(".overview.json")
    upstream_overview_json = json.loads(upstream_overview_file.read_text()) if upstream_overview_file.exists() else {}

    upstream_targets_file = pathlib.Path(".targets.json")
    upstream_targets_json = json.loads(upstream_targets_file.read_text()) if upstream_targets_file.exists() else {}

    upstream_profiles_file = pathlib.Path("profiles.json")
    upstream_profiles_json = json.loads(upstream_profiles_file.read_text()) if upstream_profiles_file.exists() else {}

    release_overview_file = release_dir / ".overview.json"
    release_overview_json = json.loads(release_overview_file.read_text()) if release_overview_file.exists() else upstream_overview_json

    release_targets_file = release_dir / ".targets.json"
    release_targets_json = json.loads(release_targets_file.read_text()) if release_targets_file.exists() else upstream_targets_json

    release_profile_file = release_dir / "targets" / release_target / "profiles.json"
    release_profile_json = json.loads(release_profile_file.read_text()) if release_profile_file.exists() else upstream_profiles_json

    profiles = {
        device_id: {
            key: value
            for key, value in profile.items()
            if not key.startswith("image")
        }
        for device_id, profile in upstream_profiles_json.get("profiles", {}).items()
    }

    for device_id, profile in release_profile_json.get("profiles", {}).items():
        upstream_profile = profiles.get(device_id)
        profile["device_packages"] = (profile.get("device_packages") or (upstream_profile or {}).get("device_packages") or [])
        if not upstream_profile:
            profile['custom'] = True
        profiles[device_id] = profile

    release_profile_json["target"] = release_target
    release_profile_json["version_number"] = release_overview_json["release"]
    release_profile_json["arch_packages"] = release_targets_json[release_target]
    release_profile_json["default_packages"] = release_profile_json.get("default_packages", [])
    release_profile_json["profiles"] = profiles

    overview_profiles = {
        (profile.get("target"), profile.get("id")): profile
        for profile in upstream_overview_json.get("profiles", [])
        if profile.get("target") and profile.get("id")
    }

    overview_profiles.update(
        {
            (profile.get("target"), profile.get("id")): profile
            for profile in release_overview_json.get("profiles", [])
            if profile.get("target") and profile.get("id")
        }
    )

    for device_id, profile in profiles.items():
        key = (release_target, device_id)

        if key not in overview_profiles:
            overview_profiles[key] = {
                "id": device_id,
                "titles": profile.get("titles"),
                "target": release_target,
            }

    merged_overview_json = {
        **upstream_overview_json,
        **release_overview_json,
    }

    merged_overview_json["profiles"] = list(overview_profiles.values())

    release_profile_file.write_text(
        json.dumps(release_profile_json, sort_keys=True)
    )

    release_overview_file.write_text(
        json.dumps(merged_overview_json, sort_keys=True)
    )

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