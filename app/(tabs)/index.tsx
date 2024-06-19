// Calendar.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { CheckCircleIcon, MapPinIcon } from 'react-native-heroicons/solid';
import { ClockIcon } from 'react-native-heroicons/outline';

const Calendar = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://xjvq5wtiye.execute-api.us-east-1.amazonaws.com/interview/api/v1/challenge')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircleIcon size={20} color="#00B47D" />;
      case 'Scheduled':
        return <ClockIcon size={20} color="#00B47D" />;
      case 'Unscheduled':
        return <Text style={styles.tbdText}>TBD</Text>;
      default:
        return null;
    }
  };

  const renderCards = (actions, customer) => {
    return actions.map(action => {
      let cardStyle = styles.unscheduledCard;
      let statusText = '';
      if (action.status === 'Completed') {
        cardStyle = styles.completedCard;
        statusText = 'Completed';
      } else if (action.status === 'Scheduled') {
        cardStyle = styles.scheduledCard;
        statusText = `Scheduled ${action.arrivalStartWindow} - ${action.arrivalEndWindow}`;
      }else{
        statusText = 'Schedule date & time TBD';
      }

      return (
        <View key={action.id} style={styles.cardContainer}>
          <View style={styles.dayColumn}>
            {action.scheduledDate ? (
              <>
                <Text style={styles.dayName}>{new Date(action.scheduledDate).toLocaleString('en-US', { weekday: 'short' }).toUpperCase()}</Text>
                <Text style={styles.dayNumber}>{new Date(action.scheduledDate).getDate()}</Text>
                {getStatusIcon(action.status)}
              </>
            ) : (
              getStatusIcon(action.status)
            )}
          </View>
          <View style={[styles.card, cardStyle]}>
            <Text style={styles.boldTitle}>{action.name}</Text>
            {action.vendor && (
              <>
                <Text style={styles.cardText}>{action.vendor.vendorName}</Text>
                <Text style={styles.boldText}>{action.vendor.phoneNumber}</Text>
                <Text></Text>
              </>
            )}
            <View style={styles.addressContainer}>
              <MapPinIcon size={20} color="white"/>
              <Text style={styles.address}>{customer.street}</Text>
            </View>
            <Text style={styles.cardText}>{statusText}</Text>
          </View>
        </View>
      );
    });
  };

  const renderCalendar = () => {
    if (loading) {
      return <Text>Loading...</Text>;
    }

    return data.calendar.map(month => {
      const date = new Date(month.year, month.month - 1); 
      const formattedMonthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });

      return (
        <View key={`${month.year}-${month.month}`} style={styles.monthContainer}>
          <Text style={styles.monthYear}>{formattedMonthYear}</Text>
          {month.actions.length > 0 ? (
            renderCards(month.actions, data.customer)
          ) : (
            <View style={[styles.noServiceCard, { marginLeft: 40 }]}>

              <Text style={styles.boldTitle}>No Maintenance Scheduled</Text>
            </View>
            
          )}
        </View>
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      {renderCalendar()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    marginTop: 40,
    textAlign: 'center'
  },
  monthContainer: {
    marginBottom: 20,
  },
  monthYear: {
    fontSize: 20,
    marginBottom: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayColumn: {
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 50
  },
  card: {
    padding: 15,
    borderRadius: 5,
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold',
    color: 'white'
  },
  boldTitle: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 15 
  },
  completedCard: {
    backgroundColor: '#00B47D',
  },
  scheduledCard: {
    backgroundColor: '#006A4B',
  },
  unscheduledCard: {
    backgroundColor: '#011638',
  },
  noServiceCard: {
    backgroundColor: '#848FA5',
    padding: 15,
    borderRadius: 5,
  },
  dayName: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  tbdText: {
    color: 'black',
    marginTop: 10,
  },
  cardText: {
    color: 'white',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },  
  address: {
    color: 'white',
    marginLeft: 5,
  },
  
});

export default Calendar;
