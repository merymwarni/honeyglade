
document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. HAMBURGER MENU
    // ==========================================

    const hamburgerButton = document.getElementById("hamburgerButton");
    const hamburgerMenu = document.querySelector(".hamburger-menu");

    if (hamburgerButton && hamburgerMenu) {
        hamburgerButton.addEventListener("click", function () {
            hamburgerMenu.classList.toggle("open");

            const isOpen = hamburgerMenu.classList.contains("open");

            hamburgerButton.setAttribute("aria-expanded", isOpen);
            hamburgerButton.setAttribute(
                "aria-label",
                isOpen ? "Close menu" : "Open menu"
            );
        });
    }


    // ==========================================
    // 2. PAGE NAVIGATION
    // ==========================================

    const pages = document.querySelectorAll(".page-section");
    const navigationLinks = document.querySelectorAll('a[href^="#"]');

    function showPage(target) {
        if (!target) return;

        const targetPage = target.closest(".page-section");
        if (!targetPage) return;

        pages.forEach(function (page) {
            page.classList.remove("active");
        });

        targetPage.classList.add("active");

        if (target === targetPage) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        } else {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }


    // ==========================================
    // 3. NAVIGATION LINK CLICK
    // ==========================================

    navigationLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            const target = document.getElementById(href.substring(1));
            if (!target) return;

            event.preventDefault();

            if (target.classList.contains("skill-subpage")) {
                showPage(document.getElementById("skills"));
                showSkillPage(target.id);
            } else {
                showPage(target);
            }

            if (hamburgerMenu) {
                hamburgerMenu.classList.remove("open");
            }

            if (hamburgerButton) {
                hamburgerButton.setAttribute("aria-expanded", "false");
                hamburgerButton.setAttribute("aria-label", "Open menu");
            }
        });
    });


    // ==========================================
    // 4. LISTENING CORNER - CHECK ANSWERS
    // ==========================================

    const checkButton = document.getElementById("checkListeningAnswers");

    if (checkButton) {
        checkButton.addEventListener("click", checkListeningAnswers);
    }


    // ==========================================
    // 5. SPEAKING MISSION - VOICE RECORDER
    // ==========================================

    const recordButton = document.getElementById("recordButton");
    const stopButton = document.getElementById("stopButton");
    const playButton = document.getElementById("playButton");
    const recordedAudio = document.getElementById("recordedAudio");
    const recordingStatus = document.getElementById("recordingStatus");

    let mediaRecorder = null;
    let audioChunks = [];
    let recordedAudioURL = null;
    let currentStream = null;

    if (recordButton && stopButton && playButton && recordedAudio) {

        stopButton.disabled = true;
        playButton.disabled = true;

        recordButton.addEventListener("click", async function () {

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert("Microphone recording is not supported. Please use HTTPS or localhost.");
                return;
            }

            if (!window.MediaRecorder) {
                alert("Your browser does not support audio recording.");
                return;
            }

            try {
                currentStream = await navigator.mediaDevices.getUserMedia({
                    audio: true
                });

                audioChunks = [];
                mediaRecorder = new MediaRecorder(currentStream);

                mediaRecorder.ondataavailable = function (event) {
                    if (event.data && event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = function () {

                    const audioBlob = new Blob(audioChunks, {
                        type: mediaRecorder.mimeType || "audio/webm"
                    });

                    if (recordedAudioURL) {
                        URL.revokeObjectURL(recordedAudioURL);
                    }

                    recordedAudioURL = URL.createObjectURL(audioBlob);
                    recordedAudio.src = recordedAudioURL;

                    playButton.disabled = false;

                    if (recordingStatus) {
                        recordingStatus.textContent = "Recording completed!";
                    }

                    if (currentStream) {
                        currentStream.getTracks().forEach(function (track) {
                            track.stop();
                        });

                        currentStream = null;
                    }
                };

                mediaRecorder.start();

                recordButton.disabled = true;
                stopButton.disabled = false;
                playButton.disabled = true;

                if (recordingStatus) {
                    recordingStatus.textContent = "Recording... Speak now!";
                }

            } catch (error) {
                console.error("Recording error:", error);

                if (recordingStatus) {
                    recordingStatus.textContent =
                        "Microphone access denied or unavailable.";
                }

                alert("Please allow microphone access to record your voice.");
            }
        });

        stopButton.addEventListener("click", function () {

            if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.stop();

                recordButton.disabled = false;
                stopButton.disabled = true;

                if (recordingStatus) {
                    recordingStatus.textContent = "Processing recording...";
                }
            }
        });

        playButton.addEventListener("click", function () {
            if (recordedAudio.src) {
                recordedAudio.play().catch(function (error) {
                    console.error("Playback error:", error);
                });
            }
        });
    }


    // ==========================================
    // 6. CLEAN UP RECORDING URL
    // ==========================================

    window.addEventListener("beforeunload", function () {

        if (recordedAudioURL) {
            URL.revokeObjectURL(recordedAudioURL);
        }

        if (currentStream) {
            currentStream.getTracks().forEach(function (track) {
                track.stop();
            });
        }
    });


    // ==========================================
    // 7. LEARNING REFLECTION - FORM VALIDATION
    // ==========================================

    const reflectionForm = document.getElementById("learningReflectionForm");
    const reflectionFeedback = document.getElementById("reflectionFeedback");

    if (reflectionForm && reflectionFeedback) {

        reflectionForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!reflectionForm.checkValidity()) {
                reflectionForm.reportValidity();

                reflectionFeedback.className =
                    "reflection-feedback warning";

                reflectionFeedback.textContent =
                    "🍯 Almost There! Please complete all required fields before submitting.";

                return;
            }

            reflectionFeedback.className =
                "reflection-feedback success";

            reflectionFeedback.textContent =
                "🌟 Wonderful, Little Explorer! Your learning reflection has been completed. Thank you for sharing your experience and feedback! Keep learning and growing!";

            reflectionFeedback.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        });
    }


    // ==========================================
    // 8. WINNIE THE POOH - FINAL CHALLENGE
    // ==========================================

    const passage1 = `
One sunny morning, Winnie the Pooh woke up earlier than usual because he was excited about a picnic with his friends. He prepared a basket containing honey sandwiches, fresh fruits, and a bottle of water. Before leaving his house, he checked the weather and noticed that the sky was clear. He believed it would be a perfect day for an outdoor adventure.

When Pooh arrived at the meeting place, Piglet and Tigger were already waiting. Piglet had brought some fresh apples, while Tigger carried a colorful blanket. Rabbit arrived later because he had been taking care of his vegetable garden. He reminded everyone to avoid damaging the plants and to keep the forest clean.

The friends eventually found a beautiful place under a large tree. They enjoyed their food, shared funny stories, and laughed together. However, after the picnic, they discovered several pieces of plastic packaging and empty bottles scattered around the area. Tigger suggested leaving them behind because everyone was tired and wanted to go home. Piglet disagreed. He explained that rubbish could harm animals and damage their natural habitat.

Pooh considered Piglet's argument. Although he wanted to return home and enjoy another jar of honey, he realized that having fun should not mean ignoring responsibility. He encouraged everyone to collect the rubbish and put it into the appropriate bins. Rabbit added that many animals depended on the forest for food and shelter.

In the end, all the friends worked together to clean the picnic area. They returned home feeling tired but satisfied. Pooh understood that a meaningful adventure was not only about enjoying time with friends but also about making responsible decisions. He promised himself that he would protect nature wherever he went.
`;

    const passage2 = `
One afternoon, Pooh and his friends decided to explore a part of the Hundred Acre Wood that they had never visited. Rabbit brought a map, while Owl carried a small notebook to record interesting discoveries. Tigger was especially excited because he wanted to find a new place to jump. Piglet, however, felt uncertain because the path looked unfamiliar and the trees were much taller than usual.

At first, the journey seemed easy. The friends followed a narrow path beside a small river. However, after walking for almost an hour, they reached a place where the path divided into three directions. Rabbit examined his map carefully but discovered that the area was not included in the version he had brought. Owl suggested choosing the path with the most sunlight because it might lead them toward an open area.

Tigger immediately wanted to follow the widest path. He argued that a wider path would probably be safer. Piglet disagreed and pointed out that its surface was covered with broken branches and slippery leaves. Pooh listened to both suggestions before making a decision. Instead of choosing quickly, he asked everyone to observe the surroundings and look for signs of human activity.

After examining the area, Owl noticed several footprints near the narrowest path. Rabbit also found a wooden sign partly covered by leaves. The sign indicated that the path led to a small observation point near the river. The friends decided to follow it carefully. Along the way, they discovered that the wider path was actually damaged by recent heavy rain.

When they finally reached the observation point, they realized that careful observation had helped them avoid a potentially dangerous route. Tigger admitted that choosing the widest path without examining it could have caused problems. Piglet felt more confident because his concerns had been taken seriously.

On their way home, Pooh reflected on the experience. He understood that making a good decision did not always mean choosing the fastest or easiest option. Sometimes, listening to different opinions, checking evidence, and considering possible consequences were much more important than acting immediately.
`;


    // ==========================================
    // 9. FINAL CHALLENGE QUESTION BANK
    // ==========================================

    const questions = [

        // READING COMPREHENSION (1-8)

        {
            category: "Reading Comprehension",
            type: "mcq",
            passageTitle: "Passage 1: A Picnic That Became a Lesson",
            passage: passage1,
            question: "1. Which statement best explains the conflict between Tigger and Piglet after the picnic?",
            options: [
                "Tigger prioritizes immediate convenience, whereas Piglet considers the possible environmental consequences.",
                "Tigger believes that the forest belongs to him, whereas Piglet wants to become its owner.",
                "Tigger is unable to understand the picnic rules, whereas Piglet wants to punish him.",
                "Tigger wants to protect the forest, whereas Piglet prefers to leave it unchanged."
            ],
            answer: 0,
            explanation: "Tigger wants to leave because he is tired, while Piglet considers the harm rubbish could cause to animals and their habitat."
        },
        {
            category: "Reading Comprehension",
            type: "mcq",
            passageTitle: "Passage 1: A Picnic That Became a Lesson",
            passage: passage1,
            question: "2. What can be inferred about Pooh's decision to support Piglet's suggestion?",
            options: [
                "He agrees only because he wants Rabbit to prepare another picnic.",
                "He recognizes that personal comfort should not outweigh environmental responsibility.",
                "He realizes that Tigger is incapable of making reasonable decisions.",
                "He believes that cleaning the forest is a way to avoid going home."
            ],
            answer: 1,
            explanation: "Pooh initially wants to go home, but he changes his decision after recognizing the importance of protecting the environment."
        },
        {
            category: "Reading Comprehension",
            type: "mcq",
            passageTitle: "Passage 1: A Picnic That Became a Lesson",
            passage: passage1,
            question: "3. If the friends had followed Tigger's suggestion, which consequence would have been the most reasonable?",
            options: [
                "The forest would immediately recover because no one disturbed it.",
                "The animals might encounter rubbish that could threaten their habitat.",
                "The picnic area would become safer because the friends had left.",
                "The rubbish would automatically disappear when the weather changed."
            ],
            answer: 1,
            explanation: "Leaving plastic packaging and bottles could expose animals to harmful waste and damage their habitat."
        },
        {
            category: "Reading Comprehension",
            type: "mcq",
            passageTitle: "Passage 1: A Picnic That Became a Lesson",
            passage: passage1,
            question: "4. Which title would best represent the deeper message of the entire passage?",
            options: [
                "The Picnic That Proved Tigger Was Always Right",
                "The Importance of Eating Healthy Food Every Morning",
                "Friendship, Responsibility, and Respect for Nature",
                "How to Prepare the Most Enjoyable Picnic in the Forest"
            ],
            answer: 2,
            explanation: "The story focuses on friendship, shared responsibility, and protecting the natural environment."
        },
        {
            category: "Reading Comprehension",
            type: "mcq",
            passageTitle: "Passage 2: The Missing Forest Path",
            passage: passage2,
            question: "5. Why did Pooh avoid choosing a path immediately after hearing his friends' suggestions?",
            options: [
                "He wanted to delay the journey until the weather became darker.",
                "He understood that a decision should be based on observation and evidence rather than assumptions.",
                "He wanted Rabbit to admit that his map was completely useless.",
                "He believed that every path in the forest was equally dangerous."
            ],
            answer: 1,
            explanation: "Pooh asks the group to examine their surroundings, showing that he values evidence before making a decision."
        },
        {
            category: "Reading Comprehension",
            type: "mcq",
            passageTitle: "Passage 2: The Missing Forest Path",
            passage: passage2,
            question: "6. What makes Tigger's initial argument unreliable?",
            options: [
                "He assumes that a wider path is safer without checking its actual condition.",
                "He has never visited any part of the forest before.",
                "He refuses to listen to Owl's explanation about the sunlight.",
                "He knows that the narrow path leads directly to the river."
            ],
            answer: 0,
            explanation: "Tigger uses the width of the path as his only evidence, but the path is actually damaged and slippery."
        },
        {
            category: "Reading Comprehension",
            type: "mcq",
            passageTitle: "Passage 2: The Missing Forest Path",
            passage: passage2,
            question: "7. Which action provides the strongest evidence that the friends made a careful decision?",
            options: [
                "They selected the path that looked the most attractive.",
                "They followed Tigger because he was the most enthusiastic.",
                "They examined footprints and a wooden sign before selecting a route.",
                "They returned home as soon as Rabbit discovered the map was incomplete."
            ],
            answer: 2,
            explanation: "The footprints and sign provide actual evidence that helps the group identify a safer route."
        },
        {
            category: "Reading Comprehension",
            type: "mcq",
            passageTitle: "Passage 2: The Missing Forest Path",
            passage: passage2,
            question: "8. Which principle is most strongly supported by the story?",
            options: [
                "The fastest decision is usually the most effective one.",
                "Confidence is more important than reliable information.",
                "A successful decision requires considering evidence and possible consequences.",
                "People should avoid unfamiliar places regardless of the situation."
            ],
            answer: 2,
            explanation: "The story demonstrates that careful observation, evidence, and consideration of consequences lead to better decisions."
        },


        // LISTENING COMPREHENSION (9-13)

        {
            category: "Listening Comprehension",
            type: "listen",
            audioTitle: "The Forest Clean-Up Plan",
            audioText: "Good morning, everyone. This Saturday, the friends in the Hundred Acre Wood are organizing a forest clean-up activity. The activity will begin at eight o'clock in the morning near the old wooden bridge. Rabbit will bring rubbish bags, while Piglet will prepare drinking water for the volunteers. Tigger has offered to invite more friends, but he must arrive before the activity begins. Pooh will coordinate the groups and make sure that recyclable materials are separated from other waste. The activity is expected to finish before midday. Everyone is encouraged to bring reusable bottles instead of disposable plastic containers. The main purpose is not simply to make the forest look beautiful, but also to protect the animals that depend on the forest for food and shelter.",
            question: "9. What is the main purpose of the forest clean-up activity?",
            options: [
                "To prepare the forest for a private picnic.",
                "To improve the environment and protect the animals' habitat.",
                "To encourage the friends to collect as many rubbish bags as possible.",
                "To replace the old wooden bridge with a new structure."
            ],
            answer: 1,
            explanation: "The announcement explicitly connects cleaning the forest with protecting animals and their habitat."
        },
        {
            category: "Listening Comprehension",
            type: "listen",
            audioTitle: "An Unexpected Change of Plans",
            audioText: "Pooh: I thought we were going to have our picnic beside the river. Rabbit: We were, but the weather forecast says there may be heavy rain. Piglet: Does that mean we have to cancel everything? Rabbit: Not necessarily. We can move the picnic to the community hall. Tigger: But the hall is not as exciting as the river. Pooh: I understand, but keeping everyone safe is more important. Piglet: We could still prepare the food and play some indoor games. Rabbit: That is a sensible suggestion. We should also inform the other friends. Tigger: All right. I will help move the picnic equipment. Pooh: Excellent. Changing our plan does not mean the adventure has to end.",
            question: "10. Which statement best describes Pooh's attitude toward the unexpected change?",
            options: [
                "He rejects the change because he believes outdoor activities are always better.",
                "He accepts the change after considering safety and alternative activities.",
                "He agrees only because Tigger promises to move the equipment.",
                "He becomes disappointed and decides to cancel the picnic completely."
            ],
            answer: 1,
            explanation: "Pooh prioritizes safety while supporting an alternative plan so the activity can continue."
        },
        {
            category: "Listening Comprehension",
            type: "listen",
            audioTitle: "Rabbit's Advice About Time",
            audioText: "Rabbit: Pooh, you said you would help me prepare the garden this morning. Pooh: I know, Rabbit. I was planning to come at nine. Rabbit: It is already ten thirty, and we have not started. Pooh: I am sorry. I spent too much time preparing my breakfast. Rabbit: The problem is not that you had breakfast. The problem is that you did not inform me that you would be late. Pooh: You are right. I should have sent you a message. Rabbit: When people make plans together, they need to respect each other's time. Pooh: I understand. Next time, I will manage my time better and communicate earlier.",
            question: "11. What does Rabbit consider the main problem with Pooh's behavior?",
            options: [
                "Pooh chooses an unhealthy breakfast.",
                "Pooh refuses to help with the garden.",
                "Pooh fails to communicate that he will arrive late.",
                "Pooh does not know how to prepare the garden."
            ],
            answer: 2,
            explanation: "Rabbit specifically explains that the main issue is the lack of communication, not breakfast itself."
        },
        {
            category: "Listening Comprehension",
            type: "listen",
            audioTitle: "A Different Way to Learn",
            audioText: "Owl: I noticed that some students memorize grammar rules but still struggle to use them in conversation. Pooh: Perhaps they need more opportunities to practice. Owl: Exactly. Understanding a rule is important, but understanding it does not automatically mean someone can use it correctly in every situation. Piglet: So, should we stop learning grammar? Owl: Not at all. Grammar provides a foundation. However, learners should combine explanations with meaningful activities, such as discussions, storytelling, and writing. Pooh: That makes sense. We learn better when we apply what we know instead of only remembering definitions.",
            question: "12. What is Owl's main argument about learning grammar?",
            options: [
                "Memorizing definitions is sufficient for effective communication.",
                "Grammar should be avoided because speaking is more important.",
                "Grammar knowledge should be combined with practical language use.",
                "Students should focus exclusively on writing activities."
            ],
            answer: 2,
            explanation: "Owl explains that grammar is important, but learners also need meaningful practice to apply it."
        },
        {
            category: "Listening Comprehension",
            type: "listen",
            audioTitle: "Choosing a Responsible Solution",
            audioText: "Piglet: I found a small bird near the river. It seems unable to fly properly. Tigger: We should take it home and keep it as a pet. Rabbit: That may not be the best idea. We do not know whether it is injured or simply learning to fly. Pooh: Perhaps we should observe it from a safe distance and ask someone with knowledge about wildlife for advice. Piglet: I agree. We should not touch it unnecessarily. Rabbit: Exactly. Wild animals need appropriate care, and our good intentions should not put them under more stress. Tigger: I understand now. Helping does not always mean taking an animal away from its natural environment.",
            question: "13. Which conclusion best reflects the group's final understanding?",
            options: [
                "Wild animals should always be taken home when they appear weak.",
                "Responsible help requires understanding an animal's needs before acting.",
                "Animals can recover more quickly when many people touch them.",
                "Good intentions are enough to justify any action toward wildlife."
            ],
            answer: 1,
            explanation: "The friends recognize that they should understand the bird's needs and avoid unnecessary interference."
        },


        // SPEAKING PRACTICE (14-19)

        {
            category: "Speaking Practice",
            type: "speak",
            question: "14. You are introducing yourself to an international student who has just joined your class. Explain who you are, describe your interests, and mention one personal goal you want to achieve this year.",
            instruction: "Speak for approximately 45–60 seconds. Organize your ideas logically and use appropriate expressions for introducing yourself.",
            rubric: "Assess your clarity, vocabulary, grammar, pronunciation, and ability to organize information."
        },
        {
            category: "Speaking Practice",
            type: "speak",
            question: "15. Your friend believes that learning English only requires memorizing vocabulary. You disagree. How would you explain why speaking, listening, reading, and writing should be developed together?",
            instruction: "Give a reasoned response. Include at least two supporting arguments and one example.",
            rubric: "Assess the strength of your arguments, clarity, grammar, vocabulary, and pronunciation."
        },
        {
            category: "Speaking Practice",
            type: "speak",
            question: "16. Imagine that Pooh invites you to a picnic, but you discover that the picnic area is full of rubbish. Explain how you would respond and suggest a responsible solution without offending your friends.",
            instruction: "Use polite expressions, explain your concern, and suggest practical actions.",
            rubric: "Assess politeness, problem-solving, fluency, grammar, and vocabulary."
        },
        {
            category: "Speaking Practice",
            type: "speak",
            question: "17. Your teacher asks whether technology always makes learning more effective. Explain your position and discuss one advantage and one possible disadvantage.",
            instruction: "Give a balanced opinion using appropriate expressions such as 'In my opinion', 'However', and 'For example'.",
            rubric: "Assess critical thinking, balanced arguments, fluency, grammar, and vocabulary."
        },
        {
            category: "Speaking Practice",
            type: "speak",
            question: "18. You and your friends have different opinions about choosing a destination for a school trip. Explain how you would help the group reach a fair decision.",
            instruction: "Describe how you would listen to different opinions, compare options, and reach an agreement.",
            rubric: "Assess communication strategy, reasoning, politeness, and language accuracy."
        },
        {
            category: "Speaking Practice",
            type: "speak",
            question: "19. Imagine you are describing an important experience from your past that taught you a valuable lesson. Explain what happened, what you learned, and how the experience may influence your future decisions.",
            instruction: "Speak in a clear sequence using past-tense expressions and a meaningful conclusion.",
            rubric: "Assess organization, use of past tense, vocabulary, fluency, and pronunciation."
        },


        // WRITING PRACTICE (20-25)

        {
            category: "Writing Practice",
            type: "write",
            question: "20. A student writes: 'She go to school every day, but yesterday she don't attend the class because she was sick.' Identify the grammatical errors and rewrite the sentence correctly.",
            instruction: "Write the corrected sentence and explain why each correction is necessary.",
            rubric: "Assess grammatical accuracy, explanation, and clarity."
        },
        {
            category: "Writing Practice",
            type: "write",
            question: "21. Write a descriptive paragraph about a person who has influenced your life. Do not only describe physical appearance; explain the person's qualities and provide examples of how those qualities influence you.",
            instruction: "Write approximately 100–120 words. Use appropriate descriptive vocabulary and supporting details.",
            rubric: "Assess organization, descriptive vocabulary, grammar, supporting details, and coherence."
        },
        {
            category: "Writing Practice",
            type: "write",
            question: "22. Your school wants to reduce plastic waste. Write a short persuasive paragraph explaining why students should bring reusable bottles and how the school community can support this action.",
            instruction: "Write approximately 100–120 words. Include a clear opinion, at least two supporting reasons, and a concluding recommendation.",
            rubric: "Assess argument quality, organization, vocabulary, grammar, and coherence."
        },
        {
            category: "Writing Practice",
            type: "write",
            question: "23. Rewrite the following ideas into a coherent paragraph: Pooh arrived late. His friends had already prepared the picnic. He apologized. They decided to continue the activity together. Explain how the events are connected.",
            instruction: "Write 5–7 connected sentences. Use suitable past-tense verbs and transition expressions.",
            rubric: "Assess sentence connections, past-tense accuracy, organization, and clarity."
        },
        {
            category: "Writing Practice",
            type: "write",
            question: "24. A friend says, 'Online learning is always better than classroom learning.' Write a response explaining whether you agree or disagree. Consider the benefits and limitations of both learning methods.",
            instruction: "Write approximately 100–120 words. Present a clear position, compare both methods, and support your opinion with examples.",
            rubric: "Assess critical reasoning, comparison, organization, vocabulary, and grammar."
        },
        {
            category: "Writing Practice",
            type: "write",
            question: "25. Imagine that you are planning an English learning activity for younger students. Write a short proposal explaining the activity, its objectives, the materials needed, and how you will evaluate whether students have learned successfully.",
            instruction: "Write approximately 100–120 words. Organize your proposal into a logical sequence and use appropriate future expressions.",
            rubric: "Assess completeness, organization, use of future expressions, grammar, and clarity."
        }
    ];


    // ==========================================
    // 10. GET FINAL CHALLENGE ELEMENTS
    // ==========================================

    const intro = document.getElementById("finalIntro");
    const assessment = document.getElementById("finalAssessment");
    const startButton = document.getElementById("startFinalChallenge");
    const questionStage = document.getElementById("questionStage");
    const counter = document.getElementById("questionCounter");
    const category = document.getElementById("questionCategory");
    const progressBar = document.getElementById("assessmentProgressBar");
    const previousButton = document.getElementById("previousQuestion");
    const nextButton = document.getElementById("nextQuestion");
    const finishButton = document.getElementById("finishChallenge");
    const feedback = document.getElementById("assessmentFeedback");
    const result = document.getElementById("assessmentResult");

    if (
        intro && assessment && startButton &&
        questionStage && counter && category &&
        progressBar && previousButton && nextButton &&
        finishButton && feedback && result
    ) {

        let currentQuestion = 0;

        let responses = questions.map(function () {
            return {
                answer: "",
                rating: ""
            };
        });


        // ======================================
        // HELPER FUNCTIONS
        // ======================================

        function escapeHTML(value) {
            return String(value).replace(/[&<>"']/g, function (character) {
                const entities = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#039;"
                };

                return entities[character];
            });
        }

        function showFeedback(message, type) {
            feedback.textContent = message;
            feedback.className = "assessment-feedback show";

            if (type === "warning") {
                feedback.classList.add("warning");
            }
        }

        function hideFeedback() {
            feedback.textContent = "";
            feedback.className = "assessment-feedback";
        }

        function stopAudio() {
            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        }


        // ======================================
        // START CHALLENGE
        // ======================================

        startButton.addEventListener("click", function () {

            intro.hidden = true;
            assessment.hidden = false;

            currentQuestion = 0;

            responses = questions.map(function () {
                return {
                    answer: "",
                    rating: ""
                };
            });

            result.hidden = true;
            questionStage.hidden = false;

            const progressContainer = document.querySelector(
                "#challenge .assessment-progress"
            );

            const navigationContainer = document.querySelector(
                "#challenge .assessment-navigation"
            );

            if (progressContainer) progressContainer.hidden = false;
            if (navigationContainer) navigationContainer.hidden = false;

            feedback.hidden = false;

            renderQuestion();

            assessment.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });


        // ======================================
        // RENDER QUESTION
        // ======================================

        function renderQuestion() {

            const q = questions[currentQuestion];
            const response = responses[currentQuestion];

            stopAudio();
            hideFeedback();

            counter.textContent =
                "Question " + (currentQuestion + 1) +
                " of " + questions.length;

            category.textContent = q.category;

            progressBar.style.width =
                ((currentQuestion + 1) / questions.length * 100) + "%";

            let html = `
                <span class="question-type">
                    ${escapeHTML(q.category)}
                </span>
            `;

            if (q.passage) {
                html += `
                    <div class="question-context">
                        <h3>${escapeHTML(q.passageTitle)}</h3>

                        ${q.passage.trim().split(/\n\s*\n/).map(function (paragraph) {
                            return `<p>${escapeHTML(paragraph.trim())}</p>`;
                        }).join("")}
                    </div>
                `;
            }

            html += `
                <h3 class="question-title">
                    ${escapeHTML(q.question)}
                </h3>
            `;


            // MULTIPLE CHOICE

            if (q.type === "mcq" || q.type === "listen") {

                html += `
                    <p class="question-instruction">
                        ${q.type === "listen"
                            ? "Listen carefully to the complete audio before choosing the best answer."
                            : "Analyze the information carefully and choose the most appropriate answer."}
                    </p>
                `;

                if (q.type === "listen") {
                    html += `
                        <div class="question-context">
                            <strong>🎧 Listening Task</strong>
                            <p>${escapeHTML(q.audioTitle)}</p>
                            <p>
                                Press the button below to listen to the audio.
                                You may replay it before selecting your answer.
                            </p>
                        </div>

                        <button type="button"
                                class="listening-play"
                                id="playListeningAudio">
                            🔊 Play Audio
                        </button>
                    `;
                }

                html += `<div class="question-options">`;

                q.options.forEach(function (option, index) {
                    html += `
                        <label class="question-option">
                            <input type="radio"
                                   name="finalAnswer"
                                   value="${index}"
                                   ${response.answer === String(index) ? "checked" : ""}>

                            <span>
                                ${String.fromCharCode(65 + index)}.
                                ${escapeHTML(option)}
                            </span>
                        </label>
                    `;
                });

                html += `</div>`;
            }


            // SPEAKING AND WRITING

            if (q.type === "speak" || q.type === "write") {

                const isSpeaking = q.type === "speak";

                html += `
                    <p class="question-instruction">
                        ${escapeHTML(q.instruction)}
                    </p>

                    ${isSpeaking ? `
                        <div class="question-context">
                            <strong>🗣️ Speaking Mission</strong>
                            <p>
                                Prepare your ideas, speak clearly,
                                and write a short note about your response.
                            </p>
                        </div>
                    ` : ""}

                    <textarea
                        id="subjectiveAnswer"
                        class="subjective-answer"
                        placeholder="${isSpeaking
                            ? "Write a short note about your spoken response..."
                            : "Write your complete answer here..."}"
                    ></textarea>

                    <div class="self-rating">
                        <label for="selfRating">
                            ${isSpeaking
                                ? "Assess your speaking performance (0–4)"
                                : "Assess your writing performance (0–4)"}
                        </label>

                        <p>${escapeHTML(q.rubric)}</p>

                        <select id="selfRating">
                            <option value="">Select your self-assessment</option>
                            <option value="0">0 - Not completed</option>
                            <option value="1">1 - Needs major improvement</option>
                            <option value="2">2 - Developing</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Excellent</option>
                        </select>
                    </div>
                `;
            }

            questionStage.innerHTML = html;


            // RESTORE PREVIOUS ANSWER

            if (q.type === "speak" || q.type === "write") {

                document.getElementById("subjectiveAnswer").value =
                    response.answer;

                document.getElementById("selfRating").value =
                    response.rating;
            }


            // LISTENING BUTTON

            if (q.type === "listen") {
                document.getElementById("playListeningAudio")
                    .addEventListener("click", playAudio);
            }


            // NAVIGATION BUTTONS

            previousButton.disabled = currentQuestion === 0;
            nextButton.hidden = currentQuestion === questions.length - 1;
            finishButton.hidden = currentQuestion !== questions.length - 1;
        }


        // ======================================
        // PLAY LISTENING AUDIO
        // ======================================

        function playAudio() {

            const q = questions[currentQuestion];

            if (!("speechSynthesis" in window)) {
                showFeedback(
                    "Your browser does not support text-to-speech.",
                    "warning"
                );
                return;
            }

            stopAudio();

            const utterance = new SpeechSynthesisUtterance(q.audioText);

            utterance.lang = "en-US";
            utterance.rate = 0.85;
            utterance.pitch = 1;

            window.speechSynthesis.speak(utterance);
        }


        // ======================================
        // SAVE RESPONSE
        // ======================================

        function saveResponse() {

            const q = questions[currentQuestion];

            if (q.type === "mcq" || q.type === "listen") {

                const selected = questionStage.querySelector(
                    'input[name="finalAnswer"]:checked'
                );

                responses[currentQuestion].answer =
                    selected ? selected.value : "";

            } else {

                const answerField =
                    document.getElementById("subjectiveAnswer");

                const ratingField =
                    document.getElementById("selfRating");

                responses[currentQuestion].answer =
                    answerField ? answerField.value.trim() : "";

                responses[currentQuestion].rating =
                    ratingField ? ratingField.value : "";
            }
        }


        // ======================================
        // CHECK ANSWER COMPLETION
        // ======================================

        function isAnswered(index) {

            const q = questions[index];
            const response = responses[index];

            if (q.type === "mcq" || q.type === "listen") {
                return response.answer !== "";
            }

            return (
                response.answer.trim() !== "" &&
                response.rating !== ""
            );
        }


        // ======================================
        // NEXT QUESTION
        // ======================================

        nextButton.addEventListener("click", function () {

            saveResponse();

            if (!isAnswered(currentQuestion)) {
                showFeedback(
                    "🍯 Please answer this question before moving to the next one.",
                    "warning"
                );
                return;
            }

            currentQuestion++;
            renderQuestion();

            questionStage.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });


        // ======================================
        // PREVIOUS QUESTION
        // ======================================

        previousButton.addEventListener("click", function () {

            saveResponse();

            if (currentQuestion > 0) {
                currentQuestion--;
                renderQuestion();

                questionStage.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });


        // ======================================
        // FINISH CHALLENGE
        // ======================================

        finishButton.addEventListener("click", function () {

            saveResponse();

            const unanswered = responses.findIndex(function (response, index) {
                return !isAnswered(index);
            });

            if (unanswered !== -1) {

                currentQuestion = unanswered;
                renderQuestion();

                showFeedback(
                    "🍯 You still have unanswered questions. Please complete all 25 questions before submitting.",
                    "warning"
                );

                return;
            }

            stopAudio();
            showResult();
        });


        // ======================================
        // CALCULATE AND SHOW RESULT
        // ======================================

        function showResult() {

            let totalScore = 0;
            let correctAnswers = 0;

            const categoryScores = {
                "Reading Comprehension": 0,
                "Listening Comprehension": 0,
                "Speaking Practice": 0,
                "Writing Practice": 0
            };

            const categoryMaximum = {
                "Reading Comprehension": 32,
                "Listening Comprehension": 20,
                "Speaking Practice": 24,
                "Writing Practice": 24
            };

            const reviewItems = [];

            questions.forEach(function (q, index) {

                let points = 0;

                if (q.type === "mcq" || q.type === "listen") {

                    const isCorrect =
                        Number(responses[index].answer) === q.answer;

                    if (isCorrect) {
                        points = 4;
                        correctAnswers++;
                    }

                    reviewItems.push({
                        number: index + 1,
                        question: q.question,
                        correct: isCorrect,
                        correctAnswer: q.options[q.answer],
                        explanation: q.explanation
                    });

                } else {
                    points = Number(responses[index].rating);
                }

                totalScore += points;
                categoryScores[q.category] += points;
            });


            // PERFORMANCE MESSAGE

            let message = "";

            if (totalScore >= 90) {
                message = "Outstanding! You have demonstrated excellent effort and critical thinking!";
            } else if (totalScore >= 80) {
                message = "Excellent work! You have shown strong English learning skills.";
            } else if (totalScore >= 70) {
                message = "Great effort! Keep improving your English proficiency.";
            } else if (totalScore >= 60) {
                message = "Good progress! Review your answers and continue practicing.";
            } else {
                message = "Keep learning, Little Explorer! Every challenge helps you improve.";
            }


            // CATEGORY BREAKDOWN

            const breakdown = Object.entries(categoryScores)
                .map(function ([name, score]) {
                    return `
                        <div>
                            <span>${escapeHTML(name)}</span>
                            <strong>${score} / ${categoryMaximum[name]}</strong>
                        </div>
                    `;
                }).join("");


            // ANSWER REVIEW

            const reviewHTML = reviewItems.map(function (item) {
                return `
                    <div class="review-item">
                        <strong>Question ${item.number}</strong>

                        <p>${escapeHTML(item.question)}</p>

                        <p>
                            <strong>
                                ${item.correct ? "✓ Correct" : "✗ Incorrect"}
                            </strong>
                        </p>

                        <p>
                            <strong>Correct answer:</strong>
                            ${escapeHTML(item.correctAnswer)}
                        </p>

                        <p>
                            <strong>Explanation:</strong>
                            ${escapeHTML(item.explanation)}
                        </p>
                    </div>
                `;
            }).join("");


            // HIDE QUESTION AREA

            questionStage.hidden = true;

            const progressContainer = document.querySelector(
                "#challenge .assessment-progress"
            );

            const navigationContainer = document.querySelector(
                "#challenge .assessment-navigation"
            );

            if (progressContainer) progressContainer.hidden = true;
            if (navigationContainer) navigationContainer.hidden = true;

            feedback.hidden = true;


            // SHOW RESULT

            result.hidden = false;

            result.innerHTML = `
                <div class="result-card">

                    <div style="font-size:38px;">
                        🏆 🍯 🌟
                    </div>

                    <h2>Congratulations, Little Explorer!</h2>

                    <p>
                        You have completed the Winnie the Pooh Final Challenge.
                    </p>

                    <div class="result-score">
                        ${totalScore}/100
                    </div>

                    <h3>${escapeHTML(message)}</h3>

                    <p>
                        You answered ${correctAnswers} out of 13
                        Reading and Listening questions correctly.
                    </p>

                    <div class="result-breakdown">
                        ${breakdown}
                    </div>

                    <p>
                        Speaking and Writing scores are based on your
                        self-assessment. They should be reviewed by a teacher
                        for a more objective evaluation.
                    </p>

                    <div class="answer-review">
                        <h3>📚 Answer Review and Explanations</h3>
                        ${reviewHTML}
                    </div>

                    <button type="button"
                            class="restart-challenge"
                            id="restartFinalChallenge">
                        Try Again ↻
                    </button>

                </div>
            `;

            result.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            document.getElementById("restartFinalChallenge")
                .addEventListener("click", restartChallenge);
        }


        // ======================================
        // RESTART CHALLENGE
        // ======================================

        function restartChallenge() {

            stopAudio();

            responses = questions.map(function () {
                return {
                    answer: "",
                    rating: ""
                };
            });

            currentQuestion = 0;

            result.hidden = true;
            questionStage.hidden = false;

            const progressContainer = document.querySelector(
                "#challenge .assessment-progress"
            );

            const navigationContainer = document.querySelector(
                "#challenge .assessment-navigation"
            );

            if (progressContainer) progressContainer.hidden = false;
            if (navigationContainer) navigationContainer.hidden = false;

            feedback.hidden = false;

            renderQuestion();

            questionStage.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }


    // ==========================================
    // 11. GLOSSARY - SEARCH VOCABULARY
    // ==========================================

    const searchInput = document.getElementById("vocabularySearch");

    const glossaryTables = document.querySelectorAll(
        "#glossary .glossary-table"
    );

    if (searchInput && glossaryTables.length > 0) {

        searchInput.addEventListener("input", function () {

            const searchValue = searchInput.value
                .toLowerCase()
                .trim();

            glossaryTables.forEach(function (table) {

                const rows = table.querySelectorAll("tbody tr");

                rows.forEach(function (row) {
                    const rowText = row.textContent.toLowerCase();

                    row.style.display =
                        rowText.includes(searchValue) ? "" : "none";
                });
            });
        });
    }

});


// ==========================================
// 12. SKILLS SUBPAGE NAVIGATION
// ==========================================

function showSkillPage(pageId) {

    const skillsPage = document.getElementById("skills");

    if (!skillsPage) return;

    const skillPages = skillsPage.querySelectorAll(".skill-subpage");

    skillPages.forEach(function (page) {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage && selectedPage.classList.contains("skill-subpage")) {
        selectedPage.classList.add("active");

        skillsPage.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// ==========================================
// 13. LISTENING CORNER - ANSWER CHECKER
// ==========================================

function checkListeningAnswers() {

    const correctAnswers = {
        "listening-q1": "b",
        "listening-q2": "a",
        "listening-q3": "c",
        "listening-q4": "a",
        "listening-q5": "b"
    };

    let score = 0;
    let answered = 0;

    for (let i = 1; i <= 5; i++) {

        const selected = document.querySelector(
            `input[name="listening-q${i}"]:checked`
        );

        if (selected) {
            answered++;

            if (
                selected.value.toLowerCase() ===
                correctAnswers[`listening-q${i}`]
            ) {
                score++;
            }
        }
    }

    if (answered < 5) {
        alert("Please answer all questions first!");
        return;
    }

    const percentage = (score / 5) * 100;

    alert(
        `Your Score: ${score}/5\n` +
        `Percentage: ${percentage}%\n\n` +
        (score === 5
            ? "Excellent! All your answers are correct!"
            : "Good effort! Keep practicing your listening skills!")
    );
}


// ==========================================
// 14. SPEAKING ACTIVITY - TEXT TO SPEECH
// ==========================================

function speakSentence(sentence) {

    if (!("speechSynthesis" in window)) {
        alert("Your browser does not support text-to-speech.");
        return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(sentence);

    speech.lang = "en-US";
    speech.rate = 0.85;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}


// ==========================================
// 15. SPEAKING ACTIVITY - FEEDBACK VOICE
// ==========================================

function speakFeedback(message) {

    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(message);

    speech.lang = "en-US";
    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}


// ==========================================
// 16. NORMALIZE SENTENCE
// ==========================================

function normalizeSentence(sentence) {

    return sentence
        .toLowerCase()
        .replace(/[’']/g, "")
        .replace(/[.,!?;:]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}


// ==========================================
// 17. SPEAKING ACTIVITY - LISTEN AND REPEAT
// ==========================================

function startSpeaking(button, expectedSentence) {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    const item = button.closest(".pronunciation-item");

    if (!item) return;

    const result = item.querySelector(".speech-result");
    const feedback = item.querySelector(".speech-feedback");

    if (!SpeechRecognition) {

        if (result) {
            result.textContent =
                "Speech recognition is not supported. Please use Google Chrome.";
        }

        return;
    }

    window.speechSynthesis.cancel();

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    if (result) {
        result.textContent = "Listening... Please speak now.";
    }

    if (feedback) {
        feedback.textContent = "";
        feedback.className = "speech-feedback";
    }

    button.disabled = true;

    recognition.onresult = function (event) {

        const spokenText = event.results[0][0].transcript;

        const expected = normalizeSentence(expectedSentence);
        const spoken = normalizeSentence(spokenText);

        if (result) {
            result.textContent = "You said: " + spokenText;
        }

        if (spoken === expected) {

            if (result) {
                result.textContent += " — Correct!";
            }

            if (feedback) {
                feedback.textContent =
                    "✓ Excellent! Your answer matches the target sentence.";
                feedback.className = "speech-feedback correct";
            }

            speakFeedback(
                "Excellent! Your answer is correct. Well done!"
            );

        } else {

            if (result) {
                result.textContent += " — Try again!";
            }

            if (feedback) {
                feedback.textContent =
                    "✗ Not quite right. Listen again and try once more.";
                feedback.className = "speech-feedback incorrect";
            }

            speakFeedback(
                "Good try! Please listen and repeat again."
            );
        }
    };


    recognition.onerror = function (event) {

        let message = "Voice not recognized. Please try again.";

        if (
            event.error === "not-allowed" ||
            event.error === "service-not-allowed"
        ) {
            message =
                "Microphone permission denied. Please allow microphone access.";
        } else if (event.error === "no-speech") {
            message = "No speech detected. Please speak and try again.";
        } else if (event.error === "network") {
            message = "Network error. Please check your internet connection.";
        }

        if (result) {
            result.textContent = message;
        }

        if (feedback) {
            feedback.textContent = "";
            feedback.className = "speech-feedback";
        }
    };


    recognition.onend = function () {
        button.disabled = false;
    };


    try {
        recognition.start();
    } catch (error) {
        console.error("Speech recognition error:", error);

        button.disabled = false;

        if (result) {
            result.textContent =
                "Could not start the microphone. Please try again.";
        }
    }
}
