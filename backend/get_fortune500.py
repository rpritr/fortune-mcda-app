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
                rank = cells[0].get_text(strip=True)  # Rank (1, 2, 3,...)
                name = cells[1].get_text(strip=True)  # Ime podjetja (Walmart,...)
                revenue = cells[2].get_text(strip=True)  # Prihodki (Revenue)
                profit = cells[4].get_text(strip=True)  # Dobiček (Profit)

                companies.append({
                    'rank': rank,
                    'name': name,
                    'revenue': revenue,
                    'profit': profit
                })

        return companies
    else:
        print(f"Failed to fetch data. Status code: {response.status_code}")
        return []