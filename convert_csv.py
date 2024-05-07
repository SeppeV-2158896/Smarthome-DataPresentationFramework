import csv
from datetime import datetime, timedelta
import pandas as pd
from IPython.display import display

def read_csv(file_path):
    return pd.read_csv(file_path, delimiter=",")

def write_csv(file_path, header, data):
    data.to_csv(file_path, index=False)

def extract_data_points(original_data, interval_minutes=1, duration_hours=(24*31)):
    display(original_data)

    df = pd.DataFrame(original_data)
    
    result = pd.DataFrame(columns = df.columns)
    
    for i in range(1,len(df['date_time'])):
        if ((i-1) % (60 * interval_minutes)) == 0:
            result = pd.concat([result, pd.DataFrame(df.filter(items=[i], axis=0), columns = df.columns)], ignore_index=True)
        if ((i-1) // (60 * interval_minutes)) > 60*duration_hours:
            break
    
    display(result)
    
    return result

    

def main():
    input_file_path = 'Appliance_data.csv'
    output_file_path = 'power.csv'

    original_data = read_csv(input_file_path)

    # Extract data points every 5 minutes for the first 24 hours
    extracted_data = extract_data_points(original_data)

    # Write the results to a new CSV file
    header = ['date_time', 'television', 'fan', 'fridge', 'laptop computer', 'electric heating element', 'oven', 'unknown', 'washing machine', 'microwave', 'toaster', 'sockets', 'cooker']


    write_csv(output_file_path, header, extracted_data)

if __name__ == "__main__":
    main()
