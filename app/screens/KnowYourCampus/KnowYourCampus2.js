import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import { BASE_URL } from '../../config/config';

const socket = io(BASE_URL);

export default function KnowYourCampus2({ route, navigation }) {
    const gameName = route?.params?.gameName;
    const [username, setUsername] = useState(route?.params?.playerName || '');
    const [points, setPoints] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionsData, setQuestionsData] = useState(null);
    const [shuffledOptions, setShuffledOptions] = useState([]);
    const [showNextButton, setShowNextButton] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [ansCorrect, setAnsCorrect] = useState(0);

    useEffect(() => {
        const loadUsername = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('user_username');
                if (storedUsername) {
                    setUsername(storedUsername);
                } else {
                    Alert.alert('Error', 'Username not found. Returning to the main screen.');
                    navigation.goBack();
                }
            } catch (error) {
                console.error('Error loading username:', error);
                Alert.alert('Error', 'Failed to load username.');
            }
        };

        if (!username) {
            loadUsername();
        }
    }, [username, navigation]);

    useEffect(() => {
        if (!gameName || !username) {
            Alert.alert('Error', 'Game name or username is missing. Returning to the main screen.');
            navigation.goBack();
            return;
        }

        socket.on('player-joined', ({ playerName }) => {
            console.log(`${playerName} has joined the quiz.`);
        });

        return () => {
            socket.off('player-joined');
        };
    }, [gameName, username]);

    const questions = [
        "Which building would Computer Science students frequent for classes?",
        "How many floors does the library have in total?",
        "How many food stalls are in Hikuwai Plaza?",
        "What time does Newsfeed close?",
        "Which TA is the best in Comp602?"
    ];

    const answers = [
        "WZ",
        "6",
        "2",
        "5pm",
        "All of the above!"
    ];

    const options = [
        ["WG", "WM", "WE"],
        ["10", "11", "3"],
        ["3", "4", "1"],
        ["3pm", "6pm", "4pm"],
        ["Matthew", "Jamie", "Hadir"]
    ];

    const selectRandomQuestions = () => {
        let indices = new Set();
        while (indices.size < 5) {
            let randomIndex = Math.floor(Math.random() * questions.length);
            indices.add(randomIndex);
        }

        const selectedQuestions = Array.from(indices).map(index => ({
            question: questions[index],
            answer: answers[index],
            options: options[index]
        }));

        setQuestionsData(selectedQuestions);
    };

    const shuffleOptions = (currentQuestion) => {
        const allOptions = [...currentQuestion.options, currentQuestion.answer];
        return allOptions.sort(() => Math.random() - 0.5);
    };

    useEffect(() => {
        selectRandomQuestions();
    }, []);

    useEffect(() => {
        if (questionsData) {
            const currentQuestion = questionsData[currentQuestionIndex];
            setShuffledOptions(shuffleOptions(currentQuestion));
        }
    }, [currentQuestionIndex, questionsData]);

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questionsData.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setShowNextButton(false);
            setSelectedAnswer(null);
        } else {
            endGame();
        }
    };

    const handleOptionSelect = (selectedOption) => {
        const currentQuestion = questionsData[currentQuestionIndex];
        
        setSelectedAnswer(selectedOption);
        
        if (selectedOption === currentQuestion.answer) {
            setAnsCorrect(ansCorrect=> ansCorrect +1);
            console.log('Updating',ansCorrect);
            updatePoints(5); // Award points for the correct answer
        }
        setShowNextButton(true);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setTimeLeft(0);
                    setTimeout(() => {
                        endGame();
                    }, 300);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const updatePoints = async (earnedPoints) => {
        try {
            const storedPoints = await AsyncStorage.getItem('user_points');
            const updatedPoints = (parseInt(storedPoints) || 0) + earnedPoints;
            setPoints(updatedPoints);
            await AsyncStorage.setItem('user_points', updatedPoints.toString());
        } catch (error) {
            console.error('Error updating points:', error);
        }
    };

    const endGame = async () => {
        console.log(ansCorrect);
        // Save points to AsyncStorage
        try {
            await AsyncStorage.setItem('total_points', (points).toString());
        } catch (error) {
            console.error('Error saving total points:', error);
        }
        
        // Navigate to the Game Ended screen
        navigation.replace('GameEnded2', { correctAnswers:ansCorrect });
    };

    if (!questionsData) {
        return <Text>Loading...</Text>;
    }

    const currentQuestion = questionsData[currentQuestionIndex];

    return (
        <View style={styles.container}>
            <Text style={styles.questionText}>
                {currentQuestion.question}
            </Text>
            {shuffledOptions.map((option, index) => {
                let buttonStyle = [styles.optionButton]; 

                if (selectedAnswer === option) {
                    buttonStyle = [
                        selectedAnswer === currentQuestion.answer ? styles.correctOption : styles.wrongOption
                    ];
                } else if (selectedAnswer !== null && option === currentQuestion.answer) {
                    buttonStyle = [styles.correctOption];
                }

                return (
                    <TouchableOpacity
                        key={index}
                        style={buttonStyle}
                        onPress={() => handleOptionSelect(option)}
                        disabled={!!selectedAnswer}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                );
            })}
            {showNextButton && (
                <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
                    <Text style={styles.nextButtonText}>Next Question</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    questionText: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    optionButton: {
        backgroundColor: '#fc6a26',
        padding: 12,
        marginVertical: 8,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    optionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    correctOption:{
        backgroundColor: '#47b553',
        padding: 12,
        marginVertical: 8,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    wrongOption:{
        backgroundColor: '#eb1a1a',
        padding: 12,
        marginVertical: 8,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    nextButton: {
        backgroundColor: 'blue',
        padding: 12,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
        marginTop: 20,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
