#!/bin/bash

clear

auto_confirm=false

show_help() {
    echo "Usage: $0 [-y] [-h]"
    echo "  -y  Auto-confirm all prompts (answer 'yes' automatically)"
    echo "  -h  Show this help message"
}

while getopts ":hy" opt; do
    case ${opt} in
        y )
            auto_confirm=true
            ;;
        h )
            show_help
            exit 0
            ;;
        \? )
            echo "Invalid option: -$OPTARG" >&2
            show_help
            exit 1
            ;;
    esac
done
shift $((OPTIND -1))

deleted_files=$(mktemp)

confirm() {
    local prompt="$1"
    local response=""

    if [ "$auto_confirm" = true ]; then
        return 0
    fi

    while true; do
        read -p "$prompt [Y/n] " response
        case $response in
            [Yy]* )
                return 0;;
            [Nn]* )
                return 1;;
            * )
                echo "Please answer yes or no.";;
        esac
    done
}

for dir in $(find backend/transcendence frontend_test/frontend -type d -name "migrations"); do
    if confirm "Do you want to check the contents of $dir?"; then
        if $auto_confirm || confirm "Do you want to delete all files inside $dir except '__init__.py'?"; then
            find "$dir" -type f ! -name "__init__.py" -exec rm -v {} + >> "$deleted_files"
        fi
    fi
done

echo "Deleted files:"
cat "$deleted_files"

rm -f "$deleted_files"