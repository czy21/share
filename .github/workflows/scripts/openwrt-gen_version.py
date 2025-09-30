import argparse
import json
import pathlib
import requests

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
