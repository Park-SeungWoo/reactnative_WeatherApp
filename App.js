import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  RefreshControl,
  ScrollView,
  Dimensions,
} from 'react-native';
import Weather from './Weather';
import { LinearGradient } from 'expo-linear-gradient';

const API_KEY = 'KEY';
const pheight = Dimensions.get('window').height;
const pwidth = Dimensions.get('window').width;

export default class App extends Component {
  state = {
    isloded: false,
    err: null,
    temperature: null,
    weathername: null,
    InfoJson: null,
    lat: 10,
    long: 10,
    refresh: false,
  };
  componentDidMount() {
    this._getPosition();
  }
  _getPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
        this._GetWeather();
      },
      (error) => {
        this.setState({
          err: error,
        });
      }
    );
  };
  _GetWeather = async () => {
    await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.lat}&lon=${this.state.long}&exclude={minutely}&appid=${API_KEY}&lang={kr}`
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
  _Refreshbtn = () => {
    this.setState({
      isloded: false,
      refresh: true,
    });
    this._Refreshfunc();
  };
  _Refreshfunc = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.lat}&lon=${this.state.long}&exclude={minutely}&appid=${API_KEY}&lang={kr}`
      )
        .then((response) => response.json())
        .then((json) => {
          // console.log(json); // 체감온도, 습도, 최고 온도, 최저 온도, 국가, 지역, 일출, 일몰 시간
          this.setState({
            temperature: json.current.temp,
            weathername: json.current.weather[0].main,
            InfoJson: json,
            isloded: true,
            refresh: false,
          });
        });
    });
  };
  render() {
    const { isloded, err, temperature, weathername, InfoJson, refresh } = this.state;
    return (
      <View style={styles.container}>
        {isloded ? ( // 여기서 리프레쉬 사용해서 위에서 아래로 스크롤하면 api정보 다시 받아올 수 있게 만들기
          <View style={styles.container}>
            <Weather weathernames={weathername} temp={temperature} infos={InfoJson} />
            {/* <TouchableOpacity style={styles.refbut} /> */}
            <ScrollView
              style={styles.refbut}
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refresh} onRefresh={this._Refreshbtn} />}
            />
          </View>
        ) : (
          <LinearGradient style={styles.Loading} colors={['lightblue', 'lightpink']}>
            <Text style={styles.LoadingText}>weather informations are loading</Text>
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
  refbut: {
    position: 'absolute',
    zIndex: 1,
    width: pwidth,
    height: pheight,
    backgroundColor: 'rgba(255, 211, 211, 0)',
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
