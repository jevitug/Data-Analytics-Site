import pandas as pd
import scholarly 
import numpy as np

citations = []
i = 0
cited = pd.read_csv("citations.csv", header=None).values
measures = pd.read_csv("measures_db.csv")[1:]
for pub in measures['Title of Publication']:
    if cited[i][0] == 0:
        print("EMPTY: ", pub)
        search_query = scholarly.search_pubs_query(pub)

        results = next(search_query, None)

        if results is None:
            citations.append(0)
            print(pub)
        else:
            try:
                print(results.citedby)
                cited.append(results.citedby)
            except AttributeError:
                print(pub)
                citations.append(0)
    else:
        citations.append(cited[i][0])
    i += 1
np.savetxt("SENDTHIS.csv", np.asarray(citations), delimiter=",")