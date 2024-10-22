import subprocess

# Domain to query
domain = "example.com"

# DNS record types to query
record_types = ["A", "MX", "TXT", "CNAME", "SRV", "NS"]

def dig_query(record_type, domain):
    """Runs the dig command and returns the output for the specified record type."""
    try:
        result = subprocess.run(
            ["dig", domain, record_type, "+short"],
            capture_output=True, text=True, check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error querying {record_type} records: {e}")
        return None

def parse_records(record_type, result):
    """Parses dig output and returns it in zone file format."""
    records = []
    if record_type == "A" or record_type == "CNAME":
        for line in result.splitlines():
            records.append(f"@ IN {record_type} {line}")
    elif record_type == "MX":
        for line in result.splitlines():
            priority, mail_server = line.split()
            records.append(f"@ IN MX {priority} {mail_server}")
    elif record_type == "TXT":
        for line in result.splitlines():
            records.append(f"@ IN TXT \"{line}\"")
    elif record_type == "SRV":
        for line in result.splitlines():
            priority, weight, port, target = line.split()
            records.append(f"_autodiscover._tcp IN SRV {priority} {weight} {port} {target}")
    elif record_type == "NS":
        for line in result.splitlines():
            records.append(f"@ IN NS {line}")
    return records

def output_zone_file(records):
    """Outputs the records in zone file format."""
    print("; Zone file generated from dig queries")
    for record in records:
        print(record)

def main():
    all_records = []
    
    for record_type in record_types:
        print(f"Querying {record_type} records for {domain}...")
        result = dig_query(record_type, domain)
        if result:
            records = parse_records(record_type, result)
            all_records.extend(records)
    
    # Output the final zone file format
    output_zone_file(all_records)

if __name__ == "__main__":
    main()
