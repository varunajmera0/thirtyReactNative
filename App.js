import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Button,
    Modal,
    AsyncStorage,
    Image,
    ImageBackground,
    TextInput,
    TouchableWithoutFeedback,
    ToastAndroid,
    Linking
} from 'react-native';
import Tts from 'react-native-tts';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {AdMobBanner} from "react-native-admob";
var {height, width} = Dimensions.get('window');

export default class App extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            swiperHeight: 0,
            display: false,
            swiperModalHeight: 0,
            swiperModalWidth: 0,
            searchNumber: "",
            initializeCount: 30,
            initializeEnglish: "Thirty",
            initializeHindi: "तीस"
        };
    }
    componentDidMount(){
        AsyncStorage.getItem('isVisited', (err, result) => {
            if (err) {
            } else {
                if (result == null) {
                    this.closeModal(true);
                } else {
                    //console.log("result", result);
                }
            }
        });
        AsyncStorage.setItem('isVisited', JSON.stringify({"value":"true"}), (err,result) => {
           // console.log("error",err,"result",result);
        });
    }

    openModal = () => {
        this.setState({modalVisible:true});
    }

    closeModal = (visible) => {
        this.setState({modalVisible:visible});
    }

    display = () => {
        return (
            <View style={styles.searchSection }>
                <Image style={styles.searchImage} source={require('./assets/images/search.png')} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Any Number"
                    value={this.state.searchNumber}
                    onChangeText={(text) =>  this.searchNumber(text)}
                    underlineColorAndroid="transparent"
                    keyboardType={Platform.OS === 'android' ? "numeric" : "number-pad"}
                    maxLength={14}
                    autoFocus={true}
                />
                <TouchableWithoutFeedback onPress={() => {this.cancel()}} style={{backgroundColor: 'red'}}>
                    <View>
                        <Image style={styles.closeImage} source={require('./assets/images/close.png')} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    notDisplay = () => {
        return (
            <TouchableWithoutFeedback onPress={() => this.onDoublePress()} >
                <View style={[styles.searchSection, {padding: 7 }] }>
                    <Text style={styles.notDisplay}>{this.state.initializeCount}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    onDoublePress = () => {
        const time = new Date().getTime();
        const delta = time - this.lastPress;
        const DOUBLE_PRESS_DELAY = 400;
        if (delta < DOUBLE_PRESS_DELAY)
            this.setState({searchNumber: this.state.initializeCount.toString(), display: true});
        this.lastPress = time;
    }

    cancel = () => {
        // set Updated / latest Value
        if ((this.state.searchNumber != "") && (!isNaN(this.state.searchNumber))) {
            this.setState((prevState) => {
                return {initializeCount: Number(prevState.searchNumber)};
            });
        }
        this.setState({display: false});
        this.setState({searchNumber: ""}); // After close textinput,  reset or empty searchNumber STate for inceremnt text/this.state.initializeCount
    }

    convertEnglish = (n) => { // upto Ten trillion == ten lakh crore / one neel / one hundred kharab / ten thousand arab
        const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
                        "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
        ];
        const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
        if (n < 0) {
            return "- " + this.convertEnglish(n);
        }

        if (n < 20) {
            return units[n];
        }

        if (n < 100) {
            return  tens[Math.trunc(n / 10)] + ((n % 10 != 0) ? " " : "") + units[n % 10];
        }

        if (n < 1000) {
            return units[Math.trunc(n / 100)] + " Hundred" + ((n % 100 != 0) ? " " : "") + this.convertEnglish(n % 100);
        }

        if (n < 100000) {
            return this.convertEnglish(Math.trunc(n / 1000)) + " Thousand" + ((n % 10000 != 0) ? " " : "") + this.convertEnglish(n % 1000);
        }

        if (n < 1000000){ // for 1 lakh
            if((Math.trunc(n / 1000)%100) == 0){
                return this.convertEnglish(Math.trunc(n / 100000)) + " Hundred Thousand" + ((n % 100000 != 0) ? " " : "") + this.convertEnglish(n % 100000);
            }else{
                return this.convertEnglish(Math.trunc(n / 100000)) + " Hundred" + ((n % 100000 != 0) ? " " : "") + this.convertEnglish(n % 100000);
            }
        }

        if (n < 100000000) { // 10 crore = 100 million se kam ???? 1crore
            return this.convertEnglish(Math.trunc(n / 1000000)) + "  Million" + ((n % 1000000 != 0) ? " " : "") + this.convertEnglish(n % 1000000);
        }

        if(n < 1000000000) { //One billion =  1 arab se kam ?? 10 crore
            if((Math.trunc(n / 1000000) % 100) == 0) {
                return this.convertEnglish(Math.trunc(n / 100000000)) + "  Hundred Million" + ((n % 100000000 != 0) ? " " : "") + this.convertEnglish(n % 100000000);
            }else{
                return this.convertEnglish(Math.trunc(n / 100000000)) + "  Hundred" + ((n % 100000000 != 0) ? " " : "") + this.convertEnglish(n % 100000000);
            }
        }

        if(n < 100000000000) { //One hundred billion =  1 kharab se kam ?? 10 arab 11 digit
            return this.convertEnglish(Math.trunc(n / 1000000000)) + " Billion" + ((n % 1000000000 != 0) ? " " : "") + this.convertEnglish(n % 1000000000);
        }

        if(n < 1000000000000) { //One hundred billion =  1 kharab se kam ?? 10 arab 12 digit
            if((Math.trunc(n / 1000000000) % 100) == 0) {
                return this.convertEnglish(Math.trunc(n / 100000000000)) + " Hundred Billion" + ((n % 100000000000 != 0) ? " " : "") + this.convertEnglish(n % 100000000000);
            }else{
                return this.convertEnglish(Math.trunc(n / 100000000000)) + " Hundred" + ((n % 100000000000 != 0) ? " " : "") + this.convertEnglish(n % 100000000000);
            }
        }

        if(n < 100000000000000) { //Ten trillion =  1 neelse kam ?? one neel  14 digit
            return this.convertEnglish(Math.trunc(n / 1000000000000)) + " Trillion" + ((n % 1000000000000 != 0) ? " " : "") + this.convertEnglish(n % 1000000000000);
        }
    }

    convertHindi = (n) => { //upto ten lakh crore / one neel / one hundred kharab / ten thousand arab == ten trillion
        const hindiUnits = ["", "एक", "दो", "तीन", "चार", "पाँच", "छह", "सात", "आठ", "नौ", "दस",
                            "ग्यारह", "बारह", "तेरह", "चौदह", "पन्द्रह", "सोलह", "सत्रह", "अठारह", "उन्नीस", "बीस",
                            "इक्कीस", "बाईस", "तेईस", "चौबीस", "पच्चीस", "छब्बीस", "सत्ताईस", "अट्ठाईस", "उनतीस", "तीस",
                            "इकतीस", "बत्तीस", "तैंतीस", "चौंतीस", "पैंतीस", "छत्तीस", "सैंतीस", "अड़तीस", "उनतालीस", "चालीस",
                            "इकतालीस", "बयालीस", "तैंतालीस", "चौवालीस", "पैंतालीस", "छियालीस", "सैंतालीस", "अड़तालीस", "उनचास", "पचास",
                            "इक्यावन", "बावन", "तिरेपन", "चौवन", "पचपन", "छप्पन", "सत्तावन", "अट्ठावन", "उनसठ", "साठ",
                            "इकसठ", "बासठ", "तिरेसठ", "चौंसठ", "पैंसठ", "छियासठ", "सड़सठ", "अड़सठ", "उनहत्तर", "सत्तर",
                            "इकहत्तर", "बहत्तर", "तिहत्तर", "चौहत्तर", "पचहत्तर", "छिहत्तर", "सतहत्तर", "अठहत्तर", "उनासी", "अस्सी",
                            "इक्यासी", "बयासी", "तिरासी", "चौरासी", "पचासी", "छियासी", "सत्तासी", "अट्ठासी", "नवासी", "नब्बे",
                            "इक्यानबे", "बानबे", "तिरानबे", "चौरानबे", "पंचानबे", "छियानबे", "सत्तानबे", "अट्ठानबे", "निन्यानबे"
        ];
        if (n < 0) {
            return "- " + this.convertHindi(n);
        }

        if (n < 100) {
            return hindiUnits[n];
        }

        if (n < 1000) {
            return hindiUnits[Math.trunc(n / 100)] + " सौ"+((n % 100 != 0) ? " " : "") + this.convertHindi(n % 100) ;
        }

        if (n < 100000) {
            return hindiUnits[Math.trunc(n / 1000)] + " हजार" + ((n % 10000 != 0) ? " " : "") + this.convertHindi(n % 1000);
        }

        if (n < 10000000) {
            return hindiUnits[Math.trunc(n / 100000)] + " लाख" + ((n % 100000 != 0) ? " " : "") + this.convertHindi(n % 100000);
        }
        if(n < 1000000000) {
            return hindiUnits[Math.trunc(n / 10000000)] + " करोड़" + ((n % 10000000 != 0) ? " " : "") + this.convertHindi(n % 10000000);
        }
        if(n < 100000000000) { //ten billion =  10 arab se kam ?? 1 arab 10 digit
            return hindiUnits[Math.trunc(n / 1000000000)] + " अरब" + ((n % 1000000000 != 0) ? " " : "") + this.convertHindi(n % 1000000000);
        }

        if(n<10000000000000) { //One hundred billion =  1 kharab se kam ?? 10 arab 13 digit
            return this.convertHindi(Math.trunc(n / 100000000000)) + " खरब" + ((n % 100000000000 != 0) ? " " : "") + this.convertHindi(n % 100000000000);
        }

        if(n<100000000000000) { //One hundred billion =  1 kharab se kam ?? 10 arab 13 digit
            return this.convertHindi(Math.trunc(n / 10000000000000	)) + " नील" + ((n % 10000000000000 != 0) ? " " : "") + this.convertHindi(n % 10000000000000);
        }
    }

    searchNumber = (n) => {
        if (!isNaN(n)) {
            if (n.length < 15){
                let num = Number(n);
                this.setState({searchNumber: n});
                if (num) {
                    this.setState({searchNumber: n});
                    this.setState({initializeCount: num});
                    this.setConverter(num);
                } else {
                    this.setState({searchNumber: ""}); // this is for if u want to clear whole inputtext
                    this.setConverter(this.state.initializeCount);
                }
            }else{
                ToastAndroid.show(
                    'You have exceeded the limit!',
                    ToastAndroid.SHORT
                );
            }
        }else{
            ToastAndroid.show(
                'Enter numbers only!',
                ToastAndroid.SHORT
            );
        }
    }

    upByOne = () => {
        if((this.state.searchNumber == "") && (this.state.initializeCount+1 < 100000000000000)) { // +1 coz state is not updated by 1 it will update after if condition fulfills
            this.setConverter(this.state.initializeCount+1)
            this.setState({initializeCount: this.state.initializeCount+1})
        }else if ((this.state.searchNumber != "") && (Number(this.state.searchNumber)+1 < 100000000000000)){
            this.setConverter(Number(this.state.searchNumber)+1)
            this.setState({searchNumber: (Number(this.state.searchNumber)+1).toString()})
        }else{
            this.setConverter(Number(this.state.searchNumber));
            const init = this.state.searchNumber != "" ? Number(this.state.searchNumber) : this.state.initializeCount;
            this.setState({initializeCount: init})
            ToastAndroid.show(
                'You have exceeded the limit!',
                ToastAndroid.SHORT
            );
        }
    }

    downByOne = () => {
        if((this.state.searchNumber == "") && (this.state.initializeCount-1 > 0)) {
            this.setConverter(this.state.initializeCount-1)
            this.setState({ initializeCount: this.state.initializeCount-1})
        }else if ((this.state.searchNumber != "") && (Number(this.state.searchNumber)-1 > 0)){
            this.setConverter(Number(this.state.searchNumber)-1)
            this.setState({ searchNumber: (Number(this.state.searchNumber)-1).toString()})
        }else{
            this.setState({display: false});
            this.setState({searchNumber: "", initializeCount: 0, initializeEnglish: 'Zero', initializeHindi: 'शून्य'});
            ToastAndroid.show(
                'You have reached 0!',
                ToastAndroid.SHORT
            );
        }
    }

    reset = () => {
        this.setState({
            initializeCount: 30,
            initializeEnglish: "Thirty",
            initializeHindi: "तीस"
        });
    }

    setConverter = (num) => {
        const eng = this.convertEnglish(num);
        this.setState({initializeEnglish: eng});
        const hi = this.convertHindi(num);
        this.setState({initializeHindi: hi});
    }

    render() {
        return (
            <ScrollView style={styles.container} keyboardShouldPersistTaps='always' >
                <ImageBackground source={require('./assets/images/screen.png')} style={styles.imageBg} resizeMode="cover">
                    <View style={styles.modalView}>
                        <Modal visible={this.state.modalVisible} animationType={'none'}
                               onRequestClose={() => this.closeModal(!this.state.modalVisible)} >
                            <View style={styles.modalContainer} onLayout={ (e) => {
                                var {x, y, width, height} = e.nativeEvent.layout;
                                this.setState({
                                    swiperModalHeight: height,
                                    swiperModalWidth: width
                                }) }
                            }>
                                <ImageBackground source={require('./assets/images/screen.png')} style={{width: this.state.swiperModalWidth, height: this.state.swiperModalHeight}} resizeMode="stretch">
                                    <View style={styles.innerContainer} onLayout={ (e) => {
                                        var {x, y, width, height} = e.nativeEvent.layout;
                                        this.setState({
                                            swiperHeight: height
                                        }) }
                                    }>
                                        <TouchableOpacity onPress={() => this.closeModal(!this.state.modalVisible)} style={{paddingRight: 14, paddingTop: 14}}>
                                            <Image style={styles.modalClose} source={require('./assets/images/close.png')}/>
                                        </TouchableOpacity>
                                        <SwiperFlatList
                                        showPagination
                                        paginationDefaultColor="#5c5c5c"
                                        paginationActiveColor="black"
                                        height={this.state.swiperHeight-50}
                                        width={width}
                                        >
                                        <View style={[styles.swiperChild]}>
                                            <View style={{flex:1, flexDirection:'column'}}>
                                                <View style={[styles.justifyAlign,{marginTop: 8, width: width*0.90, marginLeft: 5}]}>
                                                   <Text style={[styles.aboutApp,{fontSize: 30 }]}>About 30 App</Text>
                                                   <Text style={[styles.aboutApp,{fontSize: 16, marginTop: 15, marginLeft: 10 }]}>30 is a counting app which translates numbers into words (English & Hindi). Here counting begins from 30 to 1 trillion.</Text>
                                                </View>
                                                <View style={{marginLeft: 10,flexDirection: 'column', marginTop: 25}}>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={[styles.justifyAlign,styles.appIntro,{ backgroundColor: '#C0044B', marginTop: 23}]}>
                                                            <Image style={[styles.appSign,{marginTop: 3}]} source={require('./assets/images/minus.png')} />
                                                            <Text style={[styles.appText,{fontSize: 17}]}>1</Text>
                                                        </View>
                                                        <View style={[styles.appHeading,{marginTop: 23}]}>
                                                            <Text style={styles.appInstruction}>Use this button to decrement the number by one.</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={[styles.justifyAlign,styles.appIntro,{backgroundColor: '#F8BD42',marginTop: 10}]}>
                                                            <Image style={{width: 14, height: 14, alignSelf: 'center'}} source={require('./assets/images/refresh.png')} />
                                                        </View>
                                                        <View style={[styles.appHeading,{marginTop: 8}]}>
                                                            <Text style={styles.appInstruction}>Use this button to reset the number to 30.</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View  style={[styles.justifyAlign,styles.appIntro,{backgroundColor: '#197B30', marginTop: 10}]}>
                                                            <Image style={styles.appSign} source={require('./assets/images/add.png')} />
                                                            <Text style={[styles.appText,{fontSize: 17}]}>1</Text>
                                                        </View>
                                                        <View style={[styles.appHeading,{marginTop: 8}]}>
                                                            <Text style={styles.appInstruction}>Use this button to increment the number by one.</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={[styles.justifyAlign,styles.appIntro,{backgroundColor: '#927dfd', marginTop: 10}]}>
                                                            <Image style={{width: 17, height: 17, alignSelf: 'center', marginLeft: 3}} source={require('./assets/images/voiceWhite.png')} />
                                                        </View>
                                                        <View style={[styles.appHeading,{marginTop: 11}]}>
                                                            <Text style={styles.appInstruction}>Use this button to listen the audio.</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={[styles.justifyAlign,styles.appIntro,{backgroundColor: '#3a3edd', marginTop: 10}]}>
                                                            <Text style={[styles.appText,{fontSize: 16}]}>30</Text>
                                                        </View>
                                                        <View style={[styles.appHeading,{marginTop: 8}]}>
                                                            <Text style={styles.appInstruction}>Double tap on this number to jump to any number.</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={[styles.swiperChild, ]}>
                                            <View style={{flex:1, flexDirection:'column'}}>
                                                <View style={[styles.justifyAlign,{marginTop: 11, width: width*0.90, marginLeft: 12}]}>
                                                    <Text style={{textAlignVertical: 'center', textAlign: 'center', fontSize: 30, fontFamily: 'Lato-Bold', marginRight: 17 }}>About Team!</Text>
                                                </View>
                                                <View style={{flex:1, flexDirection:'column'}}>
                                                    <View style={[styles.justifyAlign,{flexDirection: 'row', marginTop: 20}]}>
                                                        <View style={{ marginTop: 20}}>
                                                            <Image style={styles.appDevImg} source={require('./assets/images/dev/pikachu.jpg')} />
                                                        </View>
                                                        <View style={[styles.appDevPost,{marginTop: 20}]}>
                                                            <Text style={styles.appDevName}>Prateek</Text>
                                                            <Text style={styles.appDevPostTitle}>UX Designer</Text>
                                                        </View>
                                                        <TouchableWithoutFeedback onPress={() => Linking.openURL('https://www.linkedin.com/in/prateek-bisht-74618b58/')}>
                                                            <View style={{ marginTop: 28,marginRight: 10}}>
                                                                <Image style={styles.appDevSocial} source={require('./assets/images/dev/linkedIn.png')} />
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    </View>
                                                    <View style={[styles.justifyAlign,{flexDirection: 'row',marginTop: 20}]}>
                                                        <View style={{ marginTop: 20}}>
                                                            <Image style={styles.appDevImg} source={require('./assets/images/dev/sneha.png')} />
                                                        </View>
                                                        <View style={[styles.appDevPost,{marginTop: 24}]}>
                                                            <Text style={styles.appDevName}>Snehalata</Text>
                                                            <Text style={styles.appDevPostTitle}>UI/UX Designer</Text>
                                                        </View>
                                                        <TouchableWithoutFeedback onPress={() => Linking.openURL('https://www.behance.net/emailsneha8c89')}>
                                                            <View style={{ marginTop: 20,marginRight: 10}}>
                                                                <Image style={styles.appDevSocial} source={require('./assets/images/dev/behance.png')} />
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    </View>
                                                    <View style={[styles.justifyAlign,{flexDirection: 'row',marginTop: 20}]}>
                                                        <View style={{ marginTop: 20}}>
                                                            <Image style={styles.appDevImg} source={require('./assets/images/dev/av.jpg')} />
                                                        </View>
                                                        <View style={[styles.appDevPost,{marginTop: 20}]}>
                                                            <Text style={styles.appDevName}>AV</Text>
                                                            <Text style={styles.appDevPostTitle}>Developer</Text>
                                                        </View>
                                                        <TouchableWithoutFeedback onPress={() => Linking.openURL('https://github.com/varunajmera0')}>
                                                            <View style={{ marginTop: 20, marginRight: 10}}>
                                                                <Image style={styles.appDevSocial} source={require('./assets/images/dev/github.png')} />
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </SwiperFlatList>
                                    </View>
                                </ImageBackground>
                            </View>
                        </Modal>
                        <TouchableWithoutFeedback onPress={() => this.openModal()}>
                            <View  style={{ paddingRight: 20, paddingTop: 13}}>
                                <Image style={{width: 20, height: 20, alignSelf: 'flex-end' }} source={require('./assets/images/menu.png')} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{width: width, height: height*0.75}}>
                        <View style={{width: width, height: height*0.15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            {this.state.display ? this.display() : this.notDisplay()}
                        </View>
                        <View style={{width,height: height*0.23}}>
                            <View style={{width,height: height*0.05,flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 18, textAlign:"center",textAlignVertical:"center", color: '#C01d72', fontFamily: 'Lato-Regular', marginBottom: 5}}>English</Text>
                                <TouchableWithoutFeedback onPress={() => Tts.speak(this.state.initializeEnglish)  }>
                                    <View>
                                        <Image style={{width: 20, height: 20, marginLeft: 5, marginBottom: 2}} source={require('./assets/images/voice.png')} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <Text style={{fontSize: 15,paddingLeft: 15, paddingRight: 15, textAlign:"center",textAlignVertical:"center", color: '#7D7D7D', fontFamily: 'Lato-Bold'}}>{this.state.initializeEnglish}</Text>
                        </View>
                        <View style={{width,height: height*0.23}}>
                            <Text style={{fontSize: 18, textAlign:"center",textAlignVertical:"center", color: '#014d88', fontFamily: 'NotoSans-Regular',marginBottom: 5}}>हिन्दी</Text>
                            <Text style={{fontSize: 15, paddingLeft: 15, paddingRight: 15 ,textAlign:"center",textAlignVertical:"center", color: '#7D7D7D', fontFamily: 'Lato-Bold'}}>{this.state.initializeHindi}</Text>
                        </View>
                        <View style={{width,height: height*0.08,flexDirection: 'row', justifyContent: 'center'}} >
                            <TouchableWithoutFeedback onPress={() => this.downByOne()}>
                                <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#C0044B',
                                    borderRadius: 40, width: width*0.23, height: 40, marginRight: 18, flexDirection: 'row'}}>
                                    <Image style={{width: 11, height: 15, marginTop: 3, marginRight: 4}} source={require('./assets/images/minus.png')} />
                                    <Text style={{fontSize: 23, color: 'white',justifyContent: 'center', fontFamily: 'Lato-Black'}}>1</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.reset()}>
                                <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8BD42', borderRadius: 40, width: width*0.23, height: 40}}>
                                    <Image style={{width: 20, height: 20, alignSelf: 'center'}} source={require('./assets/images/refresh.png')} />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.upByOne()}>
                                <View  style={{justifyContent: 'center', alignItems: 'center',backgroundColor: '#197B30',
                                    borderRadius: 40,width: width*0.23, height: 40, marginLeft: 18, flexDirection: 'row'}}>
                                    <Image style={{width: 13, height: 13, marginTop: 3, marginRight: 4}} source={require('./assets/images/add.png')} />
                                    <Text style={{fontSize: 23, color: 'white',justifyContent: 'center', fontFamily: 'Lato-Black'}}>1</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <View style={{height: height*0.19, width}}>
                        <AdMobBanner
                        adSize="smartBannerPortrait"
                        adUnitID="ca-app-pub-8354628535093380/4181340672"
                        didFailToReceiveAdWithError={this.bannerError} /></View>
                </ImageBackground>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f2f2f2'
    },
    modalContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f2f2f2'
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 20,
        marginBottom: 20,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 8,
        backgroundColor: 'white'
    },
    swiperChild: {
        height,
        width
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 70,
        marginLeft: 9,
        marginRight: 12,
        marginTop: 18,
        shadowOpacity: 0.75,
        shadowRadius: 2,
        shadowColor: 'grey',
        shadowOffset: { height: 0, width: 0 },
        elevation:1
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#fff',
        color: '#424242',
        marginLeft: 5,
        fontSize: 15
    },
    searchImage: {
        width: 18,
        height: 18,
        marginLeft: 10
    },
    closeImage: {
        width: 12,
        height: 12,
        marginRight: 13
    },
    notDisplay: {
        fontSize: 24,
        fontWeight:'200',
        textAlign:"center",
        textAlignVertical:"center",
        color: 'black'
    },
    imageBg: {
        width: width, height: height*0.96
    },
    modalView: {
        width: width, height: 70
    },
    modalClose: {
        width: 12, height: 12, alignSelf: 'flex-end'
    },
    justifyAlign: {
        justifyContent:'center', alignItems: 'center'
    },
    aboutApp: {
        textAlignVertical: 'center',
        textAlign: 'justify',
        fontFamily: 'Lato-Bold'
    },
    appIntro: {
        borderRadius: 30,
        width: width*0.14,
        height: 30,
        flexDirection: 'row'
    },
    appSign: {
        width: 9, height: 9, marginRight: 4
    },
    appText: {
        color: 'white',justifyContent: 'center', fontFamily: 'Lato-Black'
    },
    appHeading: {
        width: width*0.65,
        height: 40,
        marginRight: 10,
        marginLeft: 15,
        flexDirection: 'column'
    },
    appInstruction: {
        fontSize: 15,
        color: 'black',
        textAlign: 'justify',
        fontFamily: 'Lato-Regular'
    },
    appDevImg:{
        width: 80,
        height: 80,
        alignSelf: 'center',
        borderRadius: 70,
        marginLeft: 10,
        borderWidth: 2,
        borderColor: 'orange'
    },
    appDevPost: {
        width: width*0.38,
        height: 40,
        marginRight: 18,
        marginLeft: 10,
        flexDirection: 'column'
    },
    appDevSocial: {
        width: 40, height: 40, alignSelf: 'center'
    },
    appDevName: {
        fontSize: 20,
        color: 'black',
        textAlign: 'justify',
        fontFamily: 'Lato-Bold'
    },
    appDevPostTitle:{
        fontSize: 17,
        color: 'black',
        textAlign: 'justify',
        fontFamily: 'Lato-bold'
    }
});
