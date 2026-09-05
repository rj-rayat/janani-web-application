import os
import zipfile

def package_project():
    output_zip = 'public/janani-lims-complete.zip'
    os.makedirs('public', exist_ok=True)
    
    exclude_dirs = {'node_modules', '.git', 'dist', '.next', '__pycache__', '.turbo'}
    exclude_files = {output_zip, 'janani-lims-complete.zip', '.DS_Store'}
    
    count = 0
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk('.'):
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
            for file in files:
                filepath = os.path.join(root, file)
                relpath = os.path.relpath(filepath, '.')
                if any(ex in relpath for ex in ['node_modules', '.git', 'public/janani-lims-complete.zip']):
                    continue
                if file in exclude_files:
                    continue
                zipf.write(filepath, relpath)
                count += 1
                
    print(f"Successfully packaged {count} files into {output_zip}")

if __name__ == '__main__':
    package_project()
