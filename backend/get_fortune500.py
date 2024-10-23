import requests
from bs4 import BeautifulSoup

def get_fortune500_companies():
    url = 'https://fortune.com/ranking/global500/search/'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')

        companies = []
        table_rows = soup.select('tbody tr')  # Izberemo vse vrstice tabele

        for row in table_rows[:20]:  # Pridobimo prvih 20 podjetij
            cells = row.find_all('td')
            if len(cells) > 0:
                rank = cells[0].get_text(strip=True)  # Rang (1, 2, 3,...)
                name = cells[1].get_text(strip=True)  # Ime podjetja (Walmart,...)
                revenue = cells[2].get_text(strip=True)  # Prihodki (Revenue)
                revenue_change = cells[3].get_text(strip=True)  # Sprememba prihodkov v %
                profit = cells[4].get_text(strip=True)  # Dobiček (Profit)
                profit_change = cells[5].get_text(strip=True)  # Sprememba dobička v %
                assets = cells[6].get_text(strip=True)  # Sredstva
                employees = cells[7].get_text(strip=True)  # Stevilo zaposlenih
                rank_change = cells[8].get_text(strip=True)  # Sprememba ranga
                years_in_rank = cells[9].get_text(strip=True)  # Stevilo let v rangu

                companies.append({
                    'rank': rank,
                    'name': name,
                    'revenue': revenue,
                    'revenue_change': revenue_change,
                    'profit': profit,
                    'profit_change': profit_change,
                    'assets': assets,
                    'employees': employees,
                    'rank_change': rank_change,
                    'years_in_rank': years_in_rank,


                })

        return companies
    else:
        print(f"Failed to fetch data. Status code: {response.status_code}")
        return []