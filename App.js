import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import Weather from './Weather';
import { LinearGradient } from 'expo-linear-gradient';

const API_KEY = '3689f4e1dfc2f163ec7c300a6e9496fe';

export default class App extends Component {
  state = {
    isloded: false,
    err: null,
    temperature: null,
    weathername: null,
    InfoJson: null,
  };
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        this._GetWeather(position.coords.latitude, position.coords.longitude),
      (error) => {
        this.setState({
          err: error,
        });
      }
    );
  }
  _GetWeather = (lat, long) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude={minutely}&appid=${API_KEY}&lang={kr}`
    )
      .then((response) => response.json())
      .then((json) => {
        // console.log(json); // 체감온도, 습도, 최고 온도, 최저 온도, 국가, 지역, 일출, 일몰 시간
        this.setState({
          temperature: json.current.temp,
          weathername: json.current.weather[0].main,
          InfoJson: json,
          isloded: true,
        });
      });
  };
  render() {
    const { isloded, err, temperature, weathername, InfoJson } = this.state;
    return (
      <View style={styles.container}>
        {isloded ? ( // 여기서 리프레쉬 사용해서 위에서 아래로 스크롤하면 api정보 다시 받아올 수 있게 만들기
          <Weather
            weathernames={weathername}
            temp={temperature}
            infos={InfoJson}
          />
        ) : (
          <LinearGradient
            style={styles.Loading}
            colors={['lightblue', 'lightpink']}
          >
            <Text style={styles.LoadingText}>
              weather informations are loading
            </Text>
            {err ? <Text style={styles.errortext}>{err}</Text> : null}
          </LinearGradient>
        )}
        <StatusBar hidden={true} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 100,
    paddingLeft: 10,
  },
  LoadingText: {
    fontSize: 40,
    fontWeight: '700',
    color: 'black',
    ...Platform.select({
      ios: {
        fontFamily: 'Courier',
      },
      android: {
        fontFamily: 'serif',
        paddingLeft: 10,
      },
    }),
  },
  errortext: {
    fontSize: 30,
    color: 'red',
    fontWeight: '700',
  },
});
