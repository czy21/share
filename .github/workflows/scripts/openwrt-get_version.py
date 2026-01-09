import argparse
import json
import pathlib

parser = argparse.ArgumentParser()
parser.add_argument('-b','--branch')
args: argparse.Namespace = parser.parse_args()

versions_file = pathlib.Path(__file__).joinpath("../../../../.versions.json").resolve()
versions_json = json.loads(versions_file.read_text()) if versions_file.exists() else {}

version = next((v for v in versions_json['versions_list'] if v.startswith(args.branch)), f"{args.branch}.0")

print(version)