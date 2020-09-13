import React, {Component} from 'react';
import {StyleSheet, Text, View, Platform, ScrollView, Dimensions, Button, TouchableOpacity, RefreshControl} from 'react-native';
import PropTypes from 'prop-types';
import {LinearGradient} from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 

const {width} = Dimensions.get('window');

const DateCases = {
    1: '월요일',
    2: '화요일',
    3: '수요일',
    4: '목요일',
    5: '금요일',
    6: '토요일',
    0: '일요일'
};

let curdate = new Date();
let day = String(curdate.getDate());
let month = String(curdate.getMonth()+1);
let year = String(curdate.getFullYear());
let hour = String(curdate.getHours());
let date = String(curdate.getDay());
// console.log(day);
// console.log(month);
// console.log(year);
// console.log(hour); // 1~23
// console.log(date); // mon: 1, tue: 2...

Weather.propTypes = {
    weathernames: PropTypes.string,
    temp: PropTypes.number.isRequired,
    infos: PropTypes.object.isRequired
}

const WeatherCases = {
    Rain: {
        colors: ['lightblue', '#005BEA'],
        title: "비가 오네요!",
        subtitle: "밖에 나갈 때 우산 챙겨가세요!",
        icon: 'weather-rainy'
    },
    Clear: {
        colors: ['#FEF253', '#FF7300'],
        title: "맑은 날씨네요!",
        subtitle: "오늘같은 날은 밖에 나가 놀아야죠!!",
        icon: 'weather-sunny'
    },
    Thunderstorm: {
        colors: ['#00ECBC', '#007ADF'],
        title: "오마이갓 토르가 오고있어요!",
        subtitle: "번개 조심하세요!!",
        icon: 'weather-lightning'
    },
    Clouds: {
        colors: ['#D7D2CC', '#304352'],
        title: "날씨가 흐려요",
        subtitle: "오늘은 지루한 날이 되겠네요",
        icon: 'weather-cloudy'
    },
    Snow: {
        colors: ['#7DE2FC', '#B9B6E5'],
        title: "눈이 오네요",
        subtitle: "같이 눈사람 만들래~!",
        icon: 'weather-snowy'
    },
    Drizzle: {
        colors: ['#89F7FE', '#66A6FF'],
        title: "보슬비가 내려요!",
        subtitle: "오늘은 안에 있는게 좋을거 같아요..",
        icon: 'weather-hail'
    },
    Mist: {
        colors: ['#D7D2CC', '#304352'],
        title: "안개가 꼈어요!!",
        subtitle: "시야에 주의하세요!",
        icon: 'weather-fog'
    },
    Haze: {
        colors: ['#89F7FE', '#66A6FF'],
        title: "날이 흐려요",
        subtitle: "꿀꿀한 날이네요..",
        icon: 'weather-hazy'
    }
};

const API_KEY = 'API_KEY';

// const _RefreshButton = () => {
//     // console.log('refresh');
//     navigator.geolocation.getCurrentPosition(
//         position => _GetWeatherinfos(position.coords.latitude, position.coords.longitude),
//         // position => console.log(position)
//     )
// };

// const _GetWeatherinfos = (lat, long) => {
//     fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude={minutely}&appid=${API_KEY}&lang={kr}`)
//     .then(response => response.json())
//     .then(json => {
//         return(
//             <Weather weathernames={'Snow'} temp={27} infos={json} />
//         )
//     });
//     console.log('good', lat, long);
// }

// function _GetWeatherinfo(lat, long){
//     fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude={minutely}&appid=${API_KEY}&lang={kr}`)
//     .then(response => response.json())
//     .then(json => {
//         return(
//             <Weather weathernames={'Snow'} temp={27} infos={json} />
//         )
//     });
//     console.log('good', lat, long);
    
// }

function Weather({weathernames, temp, infos}){
    console.log(temp);
    const [refreshing] = React.useState(false);

    const _RefreshButton = () => {
        // console.log('refresh');
        navigator.geolocation.getCurrentPosition(
            position => _GetWeatherinfos(position.coords.latitude, position.coords.longitude),
            // position => console.log(position)
        )
    };

    const _GetWeatherinfos = (lat, long) => {
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude={minutely}&appid=${API_KEY}&lang={kr}`)
        .then(response => response.json())
        .then(json => {
            weathernames = 'snow',
            temp = 27,
            infos = json
        });
        console.log('good', lat, long);
    }

    return(
        <LinearGradient style={styles.container} colors={WeatherCases[weathernames].colors}>
        <ScrollView style = {styles.totalscroll}
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={_RefreshButton} />
        }>
            <View style={styles.weatherinfo}>
                <Text style={styles.locationtext}>{infos.timezone.split('/')[1]}</Text>
                <MaterialCommunityIcons style={styles.iconstyle} name={WeatherCases[weathernames].icon}/>
                <Text style={styles.tempstyles}>{Math.floor(temp - 273.15)}°</Text>
                <View style={styles.refreshButton}>
                    <Text style={styles.datetext}>{year}/{month}/{day}</Text>
                    <View>
                        <TouchableOpacity onPress={_RefreshButton}>
                            {/* <Text style={styles.buttondesign}>R</Text> */}
                            <MaterialCommunityIcons style={styles.buttondesign} name='refresh' />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.extrainfo}>
                <Text style={styles.titlestyle}>{WeatherCases[weathernames].title}</Text>
                <Text style={styles.subtitlestyle}>{WeatherCases[weathernames].subtitle}</Text>
            </View>
            <ScrollView style={styles.scrollboxinfo} showsVerticalScrollIndicator={false}>
                <View style={styles.maininfobox}>
                    <View style={styles.rowInfo}>
                        <View style={styles.InfoItems}>
                            <MaterialCommunityIcons name={"temperature-celsius"} size={50} color={'#fff'}/>
                            <Text style={styles.scrollboxtext}>체감 온도</Text>
                            <Text style={styles.scrollboxtext}>{Math.floor(infos.current.feels_like - 273.15)}°</Text>
                        </View>
                        <View style={styles.InfoItems}>
                            <MaterialCommunityIcons name={"water-outline"} size={50} color={'#fff'}/>
                            <Text style={styles.scrollboxtext}>습도</Text>
                            <Text style={styles.scrollboxtext}>{infos.current.humidity}%</Text>
                        </View>
                    </View>
                    <View style={styles.rowInfo}>
                        <View style={styles.InfoItems}>
                            <FontAwesome5 name={"temperature-high"} size={50} color={'#fff'}/>
                            <Text style={styles.scrollboxtext}>최고 온도</Text>
                            <Text style={styles.scrollboxtext}>{Math.floor(infos.daily[0].temp.max - 273.15)}°</Text>
                        </View>
                        <View style={styles.InfoItems}>
                            <FontAwesome5 name={"temperature-low"} size={50} color={'#fff'}/>
                            <Text style={styles.scrollboxtext}>최저 온도</Text>
                            <Text style={styles.scrollboxtext}>{Math.floor(infos.daily[0].temp.min - 273.15)}°</Text>
                        </View>
                    </View>
                </View>
                <ScrollView style={styles.hourlyinfoscroll} horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={styles.hourlyinfoview}>
                        {infos.hourly.map((info, i) => i < 25 ? 
                                        i == 0 ? 
                                            (<View style={styles.hourlyinfobox}>
                                                <Text style={styles.hourlyinfotext}>{hour}시</Text>
                                                <MaterialCommunityIcons name={WeatherCases[info.weather[0].main].icon} color={'white'} size={20}/>
                                                <Text style={styles.hourlyinfotext}>{Math.floor(info.temp - 273.15)}°</Text>
                                            </View>
                                            ) : 
                                            ((Number(hour) + i) < 24) ? 
                                                (<View style={styles.hourlyinfobox}>
                                                    <Text style={styles.hourlyinfotext}>{String(Number(hour) + i)}시</Text>
                                                    <MaterialCommunityIcons name={WeatherCases[info.weather[0].main].icon} color={'white'} size={20}/>
                                                    <Text style={styles.hourlyinfotext}>{Math.floor(info.temp - 273.15)}°</Text>
                                                </View>
                                                ) : (<View style={styles.hourlyinfobox}>
                                                        <Text style={styles.hourlyinfotext}>{String(Number(hour) + i - 24)}시</Text>
                                                        <MaterialCommunityIcons name={WeatherCases[info.weather[0].main].icon} color={'white'} size={20}/>
                                                        <Text style={styles.hourlyinfotext}>{Math.floor(info.temp - 273.15)}°</Text>
                                                    </View>
                                                    )
                                        : null
                                    )}
                    </View>
                </ScrollView>
                <View style={styles.dailyinfoview}>
                    {infos.daily.map((info, i) => i == 0 ? 
                                            (<View style={styles.dailyinfobox}>
                                                <Text style={styles.dailyinfotext}>{DateCases[date]}</Text>
                                                <View style={styles.dailyinfoiconview}>
                                                    <MaterialCommunityIcons name={WeatherCases[info.weather[0].main].icon} style={styles.dailyinfoicon}/>
                                                </View>
                                                <Text style={styles.dailyinfotemp}>{Math.floor(info.temp.max - 273.15)}°  {Math.floor(info.temp.min - 273.15)}°</Text> 
                                            </View>
                                            ) : (<View style={styles.dailyinfobox}>
                                                    <Text style={styles.dailyinfotext}>{DateCases[(Number(date) + i < 7) ? Number(date) + i : Number(date) + i - 7]}</Text>
                                                    <View style={styles.dailyinfoiconview}>
                                                        <MaterialCommunityIcons name={WeatherCases[info.weather[0].main].icon} style={styles.dailyinfoicon}/>
                                                    </View>
                                                    <Text style={styles.dailyinfotemp}>{Math.floor(info.temp.max - 273.15)}°  {Math.floor(info.temp.min - 273.15)}°</Text>
                                                </View>
                                            )
                                        )}
                </View> 
            </ScrollView>
        </ScrollView>
        </LinearGradient>
    );
};
// 체감온도, 습도, 최고 온도, 최저 온도, 지역

export default Weather;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    totalscroll: {
        flex:1
    },
    weatherinfo: {
        flex: 0.7,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    locationtext: {
        color: '#fff',
        fontSize: 35,
        fontWeight: '600'
    },
    extrainfo: {
        flex: 0.4,
        justifyContent: 'center',
        marginLeft: 30
    },
    iconstyle:{
        fontSize: 100,
        color: 'white'
    },
    tempstyles: {
        fontSize: 40,
        fontWeight: '700',
        color: 'white'
    },
    titlestyle: {
        fontSize: 40,
        color: 'white',
        ...Platform.select({
            ios: {
                fontWeight: '600'
            },
            android: {
                fontWeight: '700',
                marginLeft: -10
            }
        }),
    },
    subtitlestyle: {
        color: 'white',
        ...Platform.select({
            ios: {
                fontWeight: '400'
            },
            android: {
                fontWeight: '700',
                marginLeft: -10
            }
        }),
        fontSize: 25
    },
    scrollboxinfo: {
        flex: 1,
        padding: 5,
        marginLeft: 15,
        marginBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: width - 30,
        borderRadius: 15
    },
    scrollboxtext: {
        flex: 1,
        color: '#fff',
        fontSize: 25,
        marginTop: 3,
        marginBottom: 2,
        fontWeight: '700'
    },
    rowInfo: {
        flexDirection: 'row',
        marginBottom: 10
    },
    InfoItems: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 3,
        borderBottomColor: 'rgba(200, 200, 200 ,0.5)',
        margin: 7
    },
    maininfobox: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(188, 188, 188 ,0.5)',
        marginBottom: 15,
        width: width - 50,
        alignSelf: 'center'
    },
    datetext: {
        fontSize: 20,
        color: 'white',
        fontWeight: '700',
        marginTop: 10
    },
    hourlyinfoscroll: {
        flex: 1,
        marginBottom: 10,
        width: width - 50,
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(188, 188, 188 ,0.5)',
        paddingBottom: 15
    },
    hourlyinfoview: {
        flexDirection: 'row'
    },
    hourlyinfobox: {
        alignItems: 'center',
        width: 60
    },
    hourlyinfotext: {
        fontSize: 12,
        color: 'white',
        lineHeight: 20
    },
    dailyinfoview: {
        margin: 10
    },
    dailyinfobox: {
        flexDirection: 'row'
    },
    dailyinfotext: {
        lineHeight: 40,
        color: 'white',
        fontSize: 20,
    },
    dailyinfoiconview: {
        flex: 1,
        alignItems: 'center'
    },
    dailyinfoicon: {
        color: 'white',
        lineHeight: 40,
        fontSize: 20
    },
    dailyinfotemp: {
        color: 'white',
        lineHeight: 40,
        fontSize: 15,
    },
    refreshButton: {
        flexDirection: 'row'
    },
    buttondesign: {
        color: 'white',
        paddingTop: 10,
        paddingLeft: 3,
        fontSize: 20,
        fontWeight: '700',
        ...Platform.select({
            android: {
                paddingTop: 14
            }
        })
    }
})
