import argparse
import json
import pathlib


def gen_overview(release_name, release_dir):
    overview_obj = {
        "release": release_name,
        "profiles": []
    }
    targets_obj = {}
    overview_file = release_dir.joinpath(".overview.json")
    targets_file = release_dir.joinpath(".targets.json")
    for p in release_dir.rglob("profiles.json"):
        profile_obj = json.loads(p.read_text())
        profile_obj_profiles: dict[str, dict] = profile_obj["profiles"]
        for pk, pv in profile_obj_profiles.items():
            t_overview = {
                "id": pk,
                "titles": pv.get("titles"),
                "target": profile_obj["target"]
            }
            overview_obj["profiles"].append(t_overview)
        targets_obj[profile_obj["target"]] = profile_obj["arch_packages"]
    overview_file.write_text(json.dumps(overview_obj))
    targets_file.write_text(json.dumps(targets_obj))


if __name__ == '__main__':

    parser = argparse.ArgumentParser()
    parser.add_argument('--artifact-dir', required=True, type=str, help='Path to the artifact directory')
    args: argparse.Namespace = parser.parse_args()

    artifact_dir = pathlib.Path(args.artifact_dir)

    artifact_versions_file = artifact_dir.joinpath(".versions.json")

    artifact_releases_dir = artifact_dir.joinpath("releases")
    artifact_snapshots_dir = artifact_dir.joinpath("snapshots")

    versions = []
    for t in sorted(filter(lambda f: f.is_dir(), artifact_releases_dir.glob("[0-9]*")), reverse=True, key=lambda x: x.name):
        gen_overview(t.name, t)
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

    # snapshot
    gen_overview("SNAPSHOT", artifact_snapshots_dir)
