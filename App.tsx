import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet,ScrollView } from 'react-native';
import { createStore } from 'redux';
import axios from 'axios';

import { Text, Button} from '@rneui/themed';
import NewsCard from './components/NewsCards';


const App: React.FC = () => {
  const [news, setNews] = useState<any>([]);
  const [loaded_news, setLoadedNews] = useState<any>([]);
  useEffect(() => {
    getRundomNews();
  }, []);
  const reducer = (state = [], action:any) => {
    switch (action.type) {
      case 'Update':
        return action.item;
      default:
        return state;
    }
  };
  
  const store = createStore(reducer);
  const getRundomNews = async () => {
    const response = await axios.get(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    ).then((response) => { 
      store.dispatch({ type: 'Update',item: response.data });
    })
    
    callShuffle();
  };
  const callShuffle = () => {
   
    shuffleRandomNews(store.getState()).then((responses) => {
      Object.keys(responses).forEach((item, index) => {
        axios.get('https://hacker-news.firebaseio.com/v0/user/'+ responses[item].by +'.json')
          .then((response) => {
            responses[index]['karma'] = response.data.karma
          })
          .catch((error) => {
            console.error(error);
          });
      });
      const sortedNews = responses.sort((a, b) => {
        const nameA = a.hasOwnProperty("score") ? a.score : "";
        const nameB = b.hasOwnProperty("score") ? b.score : "";
      
        if (nameA < nameB) {
          return -1;
        } else if (nameA > nameB) {
          return 1;
        } else {
          return 0;
        }
      });
    
      setLoadedNews(sortedNews);
    });
  }
  const shuffleRandomNews = (randomNews:any) => {
    const endpoints = []
    for(let i = 0; i<10; i++) {
      endpoints.push(axios.get('https://hacker-news.firebaseio.com/v0/item/' + Math.floor(Math.random() * randomNews.length) + '.json'))
    }
    return Promise.all(endpoints).then((values) => {
      return values.map((response) => {
        return response.data
      });
    });
  }

  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.headerText}>MERKLE</Text>
      </View>
      <Button title="VIEW NEWS" onPress={() => {
         setNews(loaded_news)
         getRundomNews()
          }}/>
      <NewsCard news={news}/>
    </ScrollView>

  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#34a853",
    padding: 16,
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1
  },
  headerText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold"
  },
  footer: {
    backgroundColor: "blue",
    padding: 16,
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1
  },
  footerText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold"
  }
  
});

export default App;