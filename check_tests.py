import subprocess
import os

def run():
    print("Running backend tests phase...")
    try:
        # Running the test runner as a module
        # Using encoding='utf-8' and errors='ignore' to handle potential console issues
        result = subprocess.run(
            ['py', '-m', 'backend.tests.test_runner'],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore',
            cwd=os.getcwd()
        )
        
        lines = result.stdout.splitlines()
        
        # Find the final report section
        summary_start = -1
        for i, line in enumerate(lines):
            if "FINAL TEST REPORT" in line:
                summary_start = i
                break
        
        if summary_start != -1:
            print("\n" + "\n".join(lines[summary_start-1:]))
        else:
            print("Could not find summary. printing last 10 lines:")
            print("\n".join(lines[-10:]))
            
    except Exception as e:
        print(f"Error running tests: {e}")

if __name__ == "__main__":
    run()
