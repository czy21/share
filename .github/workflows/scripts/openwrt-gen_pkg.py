#!/usr/bin/env python3
import itertools
import argparse
import pathlib

if __name__ == '__main__':

    parser = argparse.ArgumentParser()
    parser.add_argument('--pkg-dir', required=True)
    parser.add_argument('--pkg-name',required=True)
    args: argparse.Namespace = parser.parse_args()

    pkg_files = pathlib.Path(args.pkg_dir).rglob(args.pkg_name)
    pkg_group = itertools.groupby(sorted(pkg_files, key=lambda t: t.name.split("_")[0]), key=lambda t: t.name.split("_")[0])
    pkg_history = []
    for k,v in pkg_group:
        v = list(sorted(v))
        pkg_history.extend(v[:-1] if v.__len__() > 1 else [])
    for t in pkg_history:
        print(t.as_posix())