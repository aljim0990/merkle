import moment from 'moment';
import { View, StyleSheet,Linking,ScrollView  } from 'react-native';
import { Text, Card, Button} from '@rneui/themed';
const NewsCard = ({news}:{news: News[]}) => {
    return(
      <View>
            {news.map((item: any, index: number) => {
                return (
                <Card>
                    <Card.Title>{item.title && (item.title)} </Card.Title>
                    <Text style={styles.card_date}>
                    {moment.unix(item['time']).format("MMM Do, YYYY")}
                    </Text>
                    <Text style={styles.card_score}>
                    Score: {item['score']}
                    </Text>
                    <Text style={styles.card_author}>
                    Author Id: {item['by']}
                    </Text>
                    <Text style={styles.card_author}>
                    Karma: {item['karma']}
                    </Text>
                    
                    <Card.Divider />
                    
                    <Button
                    buttonStyle={styles.card_button}
                    title="VIEW NOW"
                    onPress={() => Linking.openURL(item['url'])}
                    />
                </Card>
                
        
                );
            })}

      </View>
    )
}
const styles = StyleSheet.create({
  
  card_text: {
    marginBottom: 10
  },
  card_button: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  }
 

});
export default NewsCard;