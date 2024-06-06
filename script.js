const app = new Vue({
    el: '#app',
    data: {
        imageUrl: null,
        name: '',
        showDisclaimer: true,
        selectedAnswers: [],
        options: [
            { text: "👈👈", value: 1 },
            { text: "👈", value: 2 },
            { text: "🖖", value: 3 },
            { text: "👉", value: 4 },
            { text: "👉👉", value: 5 },
        ],
        questions: [
            {
                question: "🤔哪一個目標對你比較容易...",
                text: ["炸200", "跑200"],
                scale: ["X", "Y"],
            },
            {
                question: "📅跑步計劃，你更像是...",
                text: ["隨性自由派，佛系隨緣", "時間管理大師，嚴格執行"],
                scale: ["P", "J"],
            },
            {
                question: "🏞️跑步路線，你更喜歡..",
                text: ["最佳路線，效率至上", "隨心所欲，探索未知"],
                scale: ["T", "F"],
            },
            {
                question: "😳跑步時遇到其他跑者，你會...",
                text: ["聊上幾句", "戴上耳機"],
                scale: ["E", "I"],
            },            
            {
                question: "👟跑步裝備，你更在意...",
                text: ["黑科技加持，數據說話", "顏值即正義，外觀至上"],
                scale: ["T", "F"],
            },
            {
                question: "⏱️在課表練習中，你更傾向於...",
                text: ["與跑友一起訓練", "獨自埋頭苦練"],
                scale: ["E", "I"],
            },
            {
                question: "😢跑步時遇到困難，你會...",
                text: ["分析找出具體解決方案", "憑直覺和經驗調整"],
                scale: ["S", "N"],
            },
            {
                question: "🎯設定跑步目標時，你傾向...",
                text: ["追隨內心的渴望","客觀合理的目標"],
                scale: ["F", "T"],
            },
            {
                question: "🧘‍跑步後的拉筋，你更像是...",
                text: ["Freestyle 舞者，隨心所欲", "瑜伽大師，精準到位"],
                scale: ["N", "S"],
            },
            {
                question: "🛠️為比賽做準備時，你更傾向...",
                text: ["制定詳細訓練計劃", "隨心所欲隨時調整"],
                scale: ["J", "P"],
            },            
            {
                question: "⏳比賽前一晚，你通常...",
                text: ["獨自一人放鬆", "和朋友或家人聚會"],
                scale: ["I", "E"],
            },
            {
                question: "🚶‍比賽前，你更關注...",
                text: ["檢查裝備補給等細節", "想像比賽的場景氛圍"],
                scale: ["S", "N"],
            },
            {
                question: "🏃比賽中，你更傾向...",
                text: ["專注於當下配速", "欣賞沿途風景"],
                scale: ["S", "N"],
            },

            {
                question: "🍌比賽補給策略，你會...",
                text: ["預先安排", "餓了就吃"],
                scale: ["J", "P"],
            },
            {
                question: "👣賽後，你更傾向...",
                text: ["享受完賽喜悅", "分析比賽數據"],
                scale: ["P", "J"],                
            },
            {
                question: "🧱跑步遇到撞牆期時，你會...",
                text: ["找朋友或教練聊聊", "自己找方法突破"],
                scale: ["E", "I"],
            },
            {
                question: "🤨評估跑步表現時，你更重視...",
                text: ["數據和成績的提升", "帶來的快樂和滿足感"],
                scale: ["F", "T"],
            },
            {
                question: "🤔選擇座右銘...",
                text: ["保持心情愉快", "保持身體健康"],
                scale: ["X", "Y"],
            }
        ],
        currentQuestion: 0,
        selectedAnswer: null,
        mbtiScores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
        randomImageNum: Math.floor(Math.random() * 6) + 1,
    },
    computed: {
        mbtiType() {
            return `${this.mbtiScores.E > this.mbtiScores.I ? "E" : "I"}${this.mbtiScores.S > this.mbtiScores.N ? "S" : "N"}${this.mbtiScores.T > this.mbtiScores.F ? "T" : "F"}${this.mbtiScores.J > this.mbtiScores.P ? "J" : "P"}`;
        },
        mbtiDescription() {
            const mbtiDescriptions = {
                "ISTJ": { description: "堅毅的領跑者", runningStyle: "像獵豹一樣，他們總是在最前面，GPS 手錶滴答作響，每一步都精準計算。他們深信『沒有痛苦，就沒有收穫』，跑完後還要仔細分析數據，規劃下一階段的訓練。" },
                "ISFJ": { description: "溫暖的陪跑夥伴", runningStyle: "就像忠誠的拉布拉多犬，他們總是在你身邊，遞水、加油，確保你跑得開心又安全。他們喜歡和朋友一起跑，分享跑步的樂趣，讓跑步不再孤單。" },
                "INFJ": { description: "深邃的心靈跑者", runningStyle: "像貓頭鷹在夜間飛行，他們在跑步時思考人生哲理，每次跑步都是一場心靈之旅。他們喜歡獨自跑，享受寧靜的思考空間，從跑步中獲得啟發。" },
                "INTJ": { description: "理性的數據大師", runningStyle: "猶如翱翔的鷹，他們用數據分析每一步，精準制定訓練計劃，目標是超越自己，征服每一個坡道。他們對裝備有嚴格要求，相信科技能幫助他們跑得更好。" },
                "ISTP": { description: "孤獨的疾風", runningStyle: "像獨行的狼，他們享受獨自奔跑的自由，不拘泥於路線，隨時可能轉彎，探索未知的道路。他們不喜歡被束縛，追求跑步的刺激與挑戰。" },
                "ISFP": { description: "感性的風景探索者", runningStyle: "像翩翩起舞的蝴蝶，他們迷戀沿途的風景，每一步都充滿驚喜，不追求速度，只為感受當下。他們喜歡在自然中跑步，感受風和陽光的洗禮。" },
                "INFP": { description: "夢想編織者", runningStyle: "像優雅的羚羊，他們在跑步時編織夢想，想像自己馳騁在草原上，感受風的自由。他們喜歡聽著音樂跑步，讓旋律帶領他們進入另一個世界。" },
                "INTP": { description: "好奇的知識跑者", runningStyle: "像狡猾的狐狸，他們一邊跑步一邊思考問題，腦中充滿各種奇思妙想，隨時可能停下來研究路邊的花草。他們喜歡探索新的路線，挑戰自己的知識極限。" },
                "ESTP": { description: "冒險的極限挑戰者", runningStyle: "如勇猛的獅子，他們熱愛挑戰極限，越野、馬拉松、超馬都不在話下，人生信條是『沒有最狂，只有更狂』。他們喜歡在極端環境下跑步，挑戰自己的耐力。" },
                "ESFP": { description: "熱情的社交跑者", runningStyle: "像活潑的海豚，他們喜歡呼朋引伴一起跑步，邊跑邊聊，把跑步變成一場熱鬧的派對。他們喜歡參加各種跑步活動，結交新朋友。" },
                "ENFP": { description: "自由的創意跑者", runningStyle: "像自由飛翔的蜂鳥，他們總是充滿活力，喜歡嘗試新的路線和跑步方式，讓每一次跑步都充滿驚喜。他們喜歡在跑步中尋找靈感，讓創意在奔跑中迸發。" },
                "ENTP": { description: "機智的發明家跑者", runningStyle: "如靈活的猴子，他們喜歡在跑步中發掘樂趣，可能邊跑邊玩手機，或者突然停下來做個倒立。他們喜歡用科技產品記錄跑步數據，分析自己的表現。" },
                "ESTJ": { description: "務實的紀律長跑者", runningStyle: "像訓練有素的馬，他們嚴格遵守跑步計畫，風雨無阻，相信『堅持就是勝利』。他們喜歡參加長跑比賽，用毅力證明自己的實力。" },
                "ESFJ": { description: "貼心的啦啦隊隊長", runningStyle: "像可愛的企鵝，他們總是為跑友加油打氣，分享補給品，讓大家充滿歡笑。他們喜歡和朋友一起跑，享受團隊合作的樂趣。" },
                "ENFJ": { description: "激勵人心的領跑教練", runningStyle: "如領袖般的大象，他們擅長激勵他人，組織跑團，讓大家一起享受跑步的樂趣。他們喜歡分享自己的跑步經驗，幫助他人進步。" },
                "ENTJ": { description: "果斷的策略指揮官", runningStyle: "像目標明確的鯊魚，他們制定詳細的跑步策略，分析對手，追求勝利。他們喜歡參加競技性比賽，享受競爭的快感。" }
            };
            return mbtiDescriptions[this.mbtiType] || { description: "未知", runningStyle: "未知" };            
        },
         progressPercentage() {
            return (this.currentQuestion / this.questions.length) * 100;
        }
    },
    methods: {
        startQuiz() {
            if (this.name.trim() !== '') {
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
            formData.append("entry.563519898", this.name);
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
                    labels: ['外向 (E)', '實感 (S)', '思考 (T)', '判斷 (J)', '內向 (I)', '直覺 (N)', '情感 (F)', '感知 (P)'],
                    datasets: [{
                        label: 'MBTI 分數',
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
        shareResult(platform) {
            const mbtiType = this.mbtiType;
            const imageUrl = `images/${mbtiType}_${this.randomImageNum}.jpg`;
            const shareData = {
                title: '跑出你的 MBTI 人格！',
                text: `我的 MBTI 人格是 ${mbtiType}！`,
                url: window.location.href,
                files: [new File([imageUrl], 'mbti_result.jpg', { type: 'image/jpeg' })] 
            };

            if (navigator.share) { // 檢查瀏覽器是否支援 Web Share API
                navigator.share(shareData)
                    .then(() => console.log('Successful share'))
                    .catch(error => console.log('Error sharing:', error));
            } else {
                // 如果不支援 Web Share API，使用原先的分享邏輯 (Twitter, Instagram, Facebook)
                let shareUrl;
                // ... (原先的分享邏輯)
                window.open(shareUrl, "_blank");
            }
        }
    }
});
