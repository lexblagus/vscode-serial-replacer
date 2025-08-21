#!/bin/bash

# ==== PARAMETERS ====
ROOT_PATH="${1:-.}"  # Root directory, default to current directory

# Safety check
if [[ -z "$ROOT_PATH" || "$ROOT_PATH" == "/" ]]; then
    echo "Refusing to clear root directory. Please provide a valid path."
    exit 1
fi

# Create root directory if it doesn’t exist
mkdir -p "$ROOT_PATH"

# Clear root directory before generating new data
rm -rf "$ROOT_PATH"/*

# ==== CONSTANTS ====
MAX_FOLDERS=10             # Max top-level folders
MAX_SUBFOLDERS=10           # Max subfolders per folder
MAX_DEPTH=4                # Max depth of folder tree
MAX_FILES_PER_FOLDER=10    # Max files per folder
MAX_LINES_PER_FILE=10      # Max lines per file
MAX_WORDS_PER_LINE=10      # Max words per line
EXTENSIONS=("txt" "md" "log" "rst")   # Allowed file extensions

# Latin Lorem Ipsum words
LOREM="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum"

# Full NATO phonetic alphabet for folder names
FOLDER_NAMES=("alpha" "bravo" "charlie" "delta" "echo" "foxtrot" "golf" "hotel" "india" "juliett" "kilo" "lima" "mike" "november" "oscar" "papa" "quebec" "romeo" "sierra" "tango" "uniform" "victor" "whiskey" "xray" "yankee" "zulu")

# Mapping numbers to literal strings (1 → one, ... 99 → ninety-nine)
NUMBER_WORDS=(one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twenty-one twenty-two twenty-three twenty-four twenty-five twenty-six twenty-seven twenty-eight twenty-nine thirty thirty-one thirty-two thirty-three thirty-four thirty-five thirty-six thirty-seven thirty-eight thirty-nine forty forty-one forty-two forty-three forty-four forty-five forty-six forty-seven forty-eight forty-nine fifty fifty-one fifty-two fifty-three fifty-four fifty-five fifty-six fifty-seven fifty-eight fifty-nine sixty sixty-one sixty-two sixty-three sixty-four sixty-five sixty-six sixty-seven sixty-eight sixty-nine seventy seventy-one seventy-two seventy-three seventy-four seventy-five seventy-six seventy-seven seventy-eight seventy-nine eighty eighty-one eighty-two eighty-three eighty-four eighty-five eighty-six eighty-seven eighty-eight eighty-nine ninety ninety-one ninety-two ninety-three ninety-four ninety-five ninety-six ninety-seven ninety-eight ninety-nine)

# Track globally used folder names and file names
USED_FOLDERS=()
USED_FILENAMES=()

# Function to create folders and files recursively
create_folder_tree() {
    local parent_path="$1"
    local depth="$2"
    local max_folders="$3"

    # Decide how many folders to create here
    local folder_count=$(( RANDOM % max_folders + 1 ))

    # Available folder names not used yet
    local available_folders=()
    for name in "${FOLDER_NAMES[@]}"; do
        if [[ ! " ${USED_FOLDERS[@]} " =~ " $name " ]]; then
            available_folders+=("$name")
        fi
    done

    # Pick folders
    local folders_to_create=($(printf "%s\n" "${available_folders[@]}" | perl -MList::Util=shuffle -e 'print shuffle(<STDIN>);' | head -n $folder_count))

    for folder in "${folders_to_create[@]}"; do
        mkdir -p "$parent_path/$folder"
        USED_FOLDERS+=("$folder")

        # Create files in this folder
        local file_count=$(( RANDOM % MAX_FILES_PER_FOLDER + 1 ))
        # Available filenames not used globally
        local available_files=()
        for fname in "${NUMBER_WORDS[@]}"; do
            if [[ ! " ${USED_FILENAMES[@]} " =~ " $fname " ]]; then
                available_files+=("$fname")
            fi
        done
        local files_to_create=($(printf "%s\n" "${available_files[@]}" | perl -MList::Util=shuffle -e 'print shuffle(<STDIN>);' | head -n $file_count))

        for fname in "${files_to_create[@]}"; do
            USED_FILENAMES+=("$fname")
            local EXT=${EXTENSIONS[$RANDOM % ${#EXTENSIONS[@]}]}

            # Generate multi-line content
            local LINE_COUNT=$(( RANDOM % MAX_LINES_PER_FILE + 1 ))
            local CONTENT=""
            for ((i=0; i<LINE_COUNT; i++)); do
                local WORD_COUNT=$(( RANDOM % MAX_WORDS_PER_LINE + 1 ))
                local LINE=$(printf "%s\n" $LOREM | perl -MList::Util=shuffle -e 'print shuffle(<STDIN>);' | head -n $WORD_COUNT | tr '\n' ' ')
                CONTENT+="$LINE"$'\n'
            done

            echo "$CONTENT" > "$parent_path/$folder/$fname.$EXT"
        done

        # Recursively create subfolders if we haven’t reached max depth
        if (( depth < MAX_DEPTH )); then
            local next_max_folders=$(( RANDOM % MAX_SUBFOLDERS + 1 ))
            create_folder_tree "$parent_path/$folder" $((depth + 1)) $next_max_folders
        fi
    done
}

# Start creating the folder tree from root
create_folder_tree "$ROOT_PATH" 1 $MAX_FOLDERS

echo "Test data generated successfully at '$ROOT_PATH' with randomized depth and multi-line files!"
