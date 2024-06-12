const app = new Vue({
    el: '#app',
    data: {
        currentLanguage: 'zh',
        language: {},
        imageUrl: null,
        userName: '',
        showDisclaimer: true,
        selectedAnswers: [],
        options: [
            { text: "👈👈", value: 1 },
            { text: "👈", value: 2 },
            { text: "🖖", value: 3 },
            { text: "👉", value: 4 },
            { text: "👉👉", value: 5 },
        ],
        questions: [],
        currentQuestion: 0,
        selectedAnswer: null,
        mbtiScores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
        randomImageNum: Math.floor(Math.random() * 9) + 1,
    },
    computed: {
        mbtiType() {
            return `${this.mbtiScores.E > this.mbtiScores.I ? "E" : "I"}${this.mbtiScores.S > this.mbtiScores.N ? "S" : "N"}${this.mbtiScores.T > this.mbtiScores.F ? "T" : "F"}${this.mbtiScores.J > this.mbtiScores.P ? "J" : "P"}`;
        },
        mbtiDescription() {
            return this.language.mbtiDescriptions?.[this.mbtiType] || { description: "未知", runningStyle: "未知" };
        },
         progressPercentage() {
            return (this.currentQuestion / this.questions.length) * 100;
        }
    },
    methods: {
        loadLanguage() {
            fetch(`locales/${this.currentLanguage}.json`)
                .then(response => response.json())
                .then(data => {
                    this.language = data;
                    this.questions = data.questions;
                });
        },
        startQuiz() {
            if (this.userName.trim() !== '') {
                this.showDisclaimer = false;
            }
        },
        nextQuestion() {
            const answerValue = parseInt(this.selectedAnswer);
            const { scale } = this.questions[this.currentQuestion];

            const score1 = 5 - answerValue;
            const score2 = answerValue - 1;
            
            this.selectedAnswers.push(this.selectedAnswer);
            this.mbtiScores[scale[0]] += score1;
            this.mbtiScores[scale[1]] += score2;

            this.currentQuestion++;
            this.selectedAnswer = null; // 重置選項

            if (this.currentQuestion >= this.questions.length) {
                this.$nextTick(() => { this.drawRadarChart(); });
            }
        },
        submitResults() {
            const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeNb-nuAK0JqFAt3W0fB_fPwzpxzgyXFxbqH_jGRzLxmUu83Q/formResponse"; // 替換為你的表單ID
            const formData = new FormData();
            formData.append("entry.563519898", this.userName);
            formData.append("entry.1120130145", JSON.stringify(this.selectedAnswers));
            formData.append("entry.352889756", JSON.stringify(this.mbtiScores));
            formData.append("entry.731620784", this.mbtiType);

            fetch(formUrl, {
                method: "POST",
                body: formData,
                mode: "no-cors"
            }).then(() => {
                console.log("表單提交成功");
            }).catch((error) => {
                console.error("表單提交失敗", error);
            });
        },
        drawRadarChart() {
            this.submitResults();
            const ctx = document.getElementById('radar-chart').getContext('2d');
            new Chart(ctx, {
                type: 'polarArea',
                data: {
                    labels: this.language.labels,
                    datasets: [{
                        label: this.language.label,
                        data: [this.mbtiScores.E, this.mbtiScores.S, this.mbtiScores.T, this.mbtiScores.J, this.mbtiScores.I, this.mbtiScores.N, this.mbtiScores.F, this.mbtiScores.P],
                        backgroundColor: [
                            'rgba(255, 165, 0, 0.5)', // E
                            'rgba(46, 139, 87, 0.5)', // S
                            'rgba(255, 0, 0, 0.5)', // T
                            'rgba(139, 69, 19, 0.5)', // J
                            'rgba(65, 105, 225, 0.5)', // I
                            'rgba(138, 43, 226, 0.5)', // N
                            'rgba(255, 255, 0, 0.5)', // F
                            'rgba(169, 169, 169, 0.5)' // P
                        ],

                          borderWidth: 1
                    }]
                },
                options: {
                    responsive: true, // 確保圖表響應式
                    scales: {
                        r: {
                            beginAtZero: true,
                            pointLabels: {
                                display: true,
                                centerPointLabels: true,
                            },
                            ticks: {
                                 display: false 
                            }                      
                        }
                    },
                    plugins: {
                        legend: {
                            display: false                            
                        }
                    }
                }
            });
        },
        shareResult() {
            const resultContainer = document.getElementById('share-result');
            html2canvas(resultContainer, { useCORS: true }).then(canvas => { 
            const mbtiType = this.mbtiType;
            const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
            const downloadLink = document.createElement('a');
            downloadLink.href = imageUrl;
            downloadLink.download = 'mbti_result.jpg';
            downloadLink.click();
            });
        }

    },
    mounted() {
        this.loadLanguage();
    }
});
