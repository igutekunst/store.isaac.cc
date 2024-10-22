#!/usr/bin/env python
import os
import sys
import keyring
import getpass
import argparse
import secrets
import string

APP_ENV = os.getenv("APP_ENV","staging")

SERVICE_NAME = "AnsibleVault"
ACCOUNT_NAME = f"ansible_vault_password_isaac_cc_store_{APP_ENV}"

def get_vault_password():
    password = keyring.get_password(SERVICE_NAME, ACCOUNT_NAME)
    return password

def set_vault_password(generate=False):
    if generate:
        password = ''.join(secrets.choice(string.ascii_letters + string.digits + string.punctuation) for _ in range(32))
        print("Generated a new secure password.")
    else:
        password = getpass.getpass("Enter New Ansible Vault password: ")
    keyring.set_password(SERVICE_NAME, ACCOUNT_NAME, password)
    return password

def clear_vault_password():
    keyring.delete_password(SERVICE_NAME, ACCOUNT_NAME)
    print("Ansible Vault password has been cleared.")

if __name__ == "__main__":
    if len(sys.argv) == 1:
        password = get_vault_password()
        if not password:
            sys.stderr.write("No Ansible Vault password found. Please set or generate one.")
            sys.exit(1)
        print(password)
    else:
        parser = argparse.ArgumentParser(description="Manage Ansible Vault password")
        parser.add_argument("action", choices=["set", "generate", "clear"], help="Action to perform")
        args = parser.parse_args()

        if args.action == "set":
            set_vault_password()
            print("Ansible Vault password has been set.")
        elif args.action == "generate":
            stored_password = keyring.get_password(SERVICE_NAME, ACCOUNT_NAME)
            if stored_password:
                print("Ansible Vault password already exists. Use set to set it, or clear to clear it.")
            else:
                set_vault_password(generate=True)
                print("Ansible Vault password has been set.")
        elif args.action == "clear":
            clear_vault_password()
