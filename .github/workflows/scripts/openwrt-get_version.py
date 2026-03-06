import argparse
import json
import pathlib
import re

def version_key(v):
    m = re.match(r"(\d+)\.(\d+)\.(\d+)(?:-rc(\d+))?", v)
    major, minor, patch, rc = m.groups()

    major = int(major)
    minor = int(minor)
    patch = int(patch)

    # 正式版排 rc 前面
    if rc is None:
        rc_flag = 1
        rc_num = 0
    else:
        rc_flag = 0
        rc_num = int(rc)

    return (major, minor, patch, rc_flag, rc_num)

parser = argparse.ArgumentParser()
parser.add_argument('-b','--branch')
args: argparse.Namespace = parser.parse_args()

versions_file = pathlib.Path(__file__).joinpath("../../../../.versions.json").resolve()
versions_json = json.loads(versions_file.read_text()) if versions_file.exists() else {}
versions_list = versions_json.get('versions_list',[])

version = max((v for v in versions_list if v.startswith(args.branch)),key=version_key,default=f"{args.branch}.0")

print(version)