import csv
from datetime import datetime, timedelta
import pandas as pd
from IPython.display import display

def read_csv(file_path):
    return pd.read_csv(file_path)

def write_csv(file_path, header, data):
    data.to_csv(file_path, index=False)

def extract_data_points(original_data, interval_minutes=5, duration_hours=24):
    display(original_data)
    
    df = original_data.iloc[:, : 22]
    del df['icon']
    
    result = pd.DataFrame(columns = df.columns)
    
    for i in range(0,len(df['time'])):
        if (i - 1) % (100 * interval_minutes) == 0:
            result = pd.concat([result, pd.DataFrame(df.filter(items=[i], axis=0), columns = df.columns)], ignore_index=True)
        if i-1 > 3600*duration_hours:
            break;
    
    display(result)
    
    return result

    

def main():
    input_file_path = 'HomeC.csv'
    output_file_path = 'power.csv'

    original_data = read_csv(input_file_path)

    # Extract data points every 5 minutes for the first 24 hours
    extracted_data = extract_data_points(original_data)

    # Write the results to a new CSV file
    header = ['time', 'use [kW]', 'gen [kW]', 'House overall [kW]', 'Dishwasher [kW]', 'Furnace 1 [kW]',
              'Furnace 2 [kW]', 'Home office [kW]', 'Fridge [kW]', 'Wine cellar [kW]', 'Garage door [kW]',
              'Kitchen 12 [kW]', 'Kitchen 14 [kW]', 'Kitchen 38 [kW]', 'Barn [kW]', 'Well [kW]', 'Microwave [kW]',
              'Living room [kW]', 'Solar [kW]', 'temperature', 'icon', 'humidity', 'visibility', 'summary',
              'apparentTemperature', 'pressure', 'windSpeed', 'cloudCover', 'windBearing', 'precipIntensity',
              'dewPoint', 'precipProbability']

    write_csv(output_file_path, header, extracted_data)

if __name__ == "__main__":
    main()
