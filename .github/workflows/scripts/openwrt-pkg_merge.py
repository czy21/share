#!/usr/bin/env python3
import argparse
import sys,json,pathlib

def get_old_packages(index_file: pathlib.Path, pkg_dir: pathlib.Path) -> list:

    with open(index_file, "r", encoding="utf-8") as f:
        index_packages = json.load(f)["packages"]

    old_packages = []

    apk_packages = [f"{k}-{v}.apk" for k, v in index_packages.items()]
    old_packages.extend([
        f for f in pkg_dir.rglob("*.apk")
        if f.name not in apk_packages
    ])

    ipk_packages = tuple(f"{k}_{v}" for k, v in index_packages.items())
    old_packages.extend([
        f for f in pkg_dir.rglob("*.ipk")
        if not f.name.startswith(ipk_packages)
    ])
    old_packages.sort(key=lambda f: f.as_posix())
    return old_packages

parser = argparse.ArgumentParser()
parser.add_argument('--artifact-dir', required=True)
parser.add_argument('--artifact-ext', nargs="+", default=[])
parser.add_argument('--package-rel',required=True)
parser.add_argument('--package-merge-name',required=True)

args: argparse.Namespace = parser.parse_args()

old_packages = []

for t in pathlib.Path(args.artifact_dir).joinpath(args.package_rel).rglob("index.json"):
    old_packages.extend(get_old_packages(t,t.parent))

for t in [p for p in pathlib.Path(args.artifact_dir).joinpath(args.package_rel).rglob(args.package_merge_name) if p.is_dir()]:
    t_idx = t.joinpath("index.json")
    if not t_idx.exists():continue
    for e in args.artifact_ext:
        e_dir = pathlib.Path(e).joinpath(t.parent.relative_to(args.artifact_dir))
        old_packages.extend(get_old_packages(t_idx,e_dir))

for p in old_packages:
    print(p.as_posix())