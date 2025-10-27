import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { UserContext } from "../../context/userContext";

// --- Role-based questions groups (same structure as before) ---
const questionBank = {
  "Frontend Developer": [
    [
      "Can you explain how the Virtual DOM works in React and why it's efficient?",
      "How do you handle state management in complex React applications?",
      "What steps would you take to improve the performance of a React app?"
    ],
    [
      "Explain the difference between Flexbox and CSS Grid with examples.",
      "How do you make a web application responsive across all devices?",
      "Describe how you would debug a rendering issue in a component."
    ],
    [
      "What are React hooks and how have they improved component reusability?",
      "How do you handle accessibility (a11y) in your frontend projects?",
      "Can you explain event delegation and give an example from your work?"
    ]
  ],
  "Backend Developer": [
    [
      "Explain how RESTful APIs work and how you secure them.",
      "What’s the difference between synchronous and asynchronous programming?",
      "How do you optimize database queries for performance?"
    ],
    [
      "How would you handle file uploads securely on a server?",
      "What are web sockets and how have you used them?",
      "Explain load balancing and its importance."
    ],
    [
      "Describe how you would design an authentication system from scratch.",
      "What’s the role of middleware in backend frameworks?",
      "How do you manage environment configurations safely?"
    ]
  ],
  "Software Engineer": [
    [
      "What design patterns have you implemented in your projects?",
      "Explain SOLID principles and how they improve code quality.",
      "Describe a complex bug you fixed and how you approached it."
    ],
    [
      "How do you ensure scalability and maintainability in software design?",
      "What’s your approach to version control and branching strategy?",
      "How do you perform code reviews effectively?"
    ],
    [
      "What’s your experience with CI/CD pipelines?",
      "Explain test-driven development and its benefits.",
      "How do you handle performance bottlenecks in large applications?"
    ]
  ],
  "Full Stack Engineer": [
    [
      "Explain how the frontend and backend communicate in your stack.",
      "How do you ensure consistency between client and server validation?",
      "What challenges have you faced managing both client and server?"
    ],
    [
      "Describe a MERN or similar stack project you worked on.",
      "How do you handle authentication across frontend and backend?",
      "What’s your strategy for deployment and environment setup?"
    ],
    [
      "How do you integrate third-party APIs efficiently?",
      "What are some best practices for full-stack debugging?",
      "Explain how you optimize data flow in full-stack apps."
    ]
  ],
  "Data Science": [
    [
      "Explain the difference between supervised and unsupervised learning.",
      "How do you handle missing data in a dataset?",
      "What’s the purpose of feature scaling?"
    ],
    [
      "Describe how you evaluate the performance of a ML model.",
      "What’s overfitting, and how do you prevent it?",
      "Explain precision, recall, and F1-score with an example."
    ],
    [
      "How do you select important features for a model?",
      "What’s the difference between bagging and boosting?",
      "Describe your process for building a data pipeline."
    ]
  ],
  "Data Analyst": [
    [
      "Explain how you clean and preprocess raw data.",
      "What’s the difference between inner join and left join?",
      "How do you detect anomalies in datasets?"
    ],
    [
      "Describe how you would create a dashboard using Power BI or Tableau.",
      "What are KPIs and how do you decide which to track?",
      "How do you ensure data accuracy when reporting?"
    ],
    [
      "What’s your process for communicating insights to non-technical teams?",
      "Explain correlation vs causation with an example.",
      "How do you handle large datasets efficiently in Excel or SQL?"
    ]
  ]
};

// --- Parallel keywords bank: each question option maps to an array of expected keypoints/keywords ---
// Keep keywords short and easily matched (lowercased) — add more to improve detection.
const keywordsBank = {
  "Frontend Developer": [
    [
      ["virtual dom", "reconciliation", "diffing", "react"],
      ["state", "redux", "context", "hooks", "mobx"],
      ["performance", "memo", "shouldcomponentupdate", "code splitting", "lazy"]
    ],
    [
      ["flexbox", "css grid", "grid", "flex"],
      ["responsive", "media query", "breakpoint", "mobile-first"],
      ["debug", "react devtools", "console", "inspector"]
    ],
    [
      ["hooks", "useeffect", "usestate", "custom hook"],
      ["accessibility", "a11y", "aria", "screen reader"],
      ["event delegation", "event bubbling", "event capturing"]
    ]
  ],
  "Backend Developer": [
    [
      ["rest", "http", "endpoints", "json"],
      ["synchronous", "asynchronous", "async", "await", "callbacks"],
      ["indexes", "query", "database", "optimization"]
    ],
    [
      ["file upload", "multipart", "stream", "validation"],
      ["websocket", "socket.io", "real-time"],
      ["load balancing", "nginx", "round-robin", "scaling"]
    ],
    [
      ["authentication", "jwt", "oauth", "password hashing"],
      ["middleware", "express", "pipeline"],
      ["env", "configuration", "secrets", "dotenv"]
    ]
  ],
  "Software Engineer": [
    [
      ["singleton", "factory", "observer", "strategy", "design pattern"],
      ["solid", "single responsibility", "open closed", "liskov"],
      ["debug", "root cause", "reproduce"]
    ],
    [
      ["scalability", "architecture", "microservices", "monolith"],
      ["git", "branch", "feature branch", "gitflow"],
      ["code review", "lint", "static analysis"]
    ],
    [
      ["ci/cd", "jenkins", "github actions", "pipeline"],
      ["tdd", "unit test", "jest"],
      ["profiling", "optimizer", "benchmark"]
    ]
  ],
  "Full Stack Engineer": [
    [
      ["api", "http", "rest", "graphql"],
      ["validation", "client side", "server side", "consistency"],
      ["deployment", "devops", "coordination"]
    ],
    [
      ["mern", "node", "express", "react", "mongo"],
      ["authentication", "tokens", "session"],
      ["docker", "pm2", "deployment"]
    ],
    [
      ["api integration", "rate limit", "retry"],
      ["debugging", "logs", "monitoring"],
      ["data flow", "state management", "caching"]
    ]
  ],
  "Data Science": [
    [
      ["supervised", "unsupervised", "labels", "clustering", "classification"],
      ["missing", "imputation", "dropna", "interpolation"],
      ["feature scaling", "standardize", "normalize"]
    ],
    [
      ["accuracy", "precision", "recall", "f1"],
      ["overfitting", "regularization", "cross validation"],
      ["confusion matrix", "roc", "auc"]
    ],
    [
      ["feature selection", "pca", "feature importance"],
      ["bagging", "boosting", "xgboost"],
      ["pipeline", "etl", "airflow"]
    ]
  ],
  "Data Analyst": [
    [
      ["clean", "preprocess", "pandas", "normalize", "formatting"],
      ["join", "inner join", "left join", "sql"],
      ["anomaly", "outlier", "z-score"]
    ],
    [
      ["dashboard", "tableau", "power bi", "visualization"],
      ["kpi", "key performance indicator"],
      ["accuracy", "validation", "reconciliation"]
    ],
    [
      ["communication", "stakeholder", "presentation"],
      ["correlation", "causation", "regression"],
      ["excel", "sql", "sampling"]
    ]
  ]
};

const motivationalQuotes = [
  "Keep going! Every step counts.",
  "You're improving with every answer!",
  "Believe in yourself, you will succeed!"
];

const WORD_THRESHOLD_SHORT = 10; // less than this considered short initial answer
const WORD_THRESHOLD_ELABORATION = 12; // threshold to accept elaboration as "detailed enough"

const InterviewPrep = () => {
  const { user } = useContext(UserContext);
  const { sessionId } = useParams();

  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]); // array of arrays of keywords per selected question
  const [awaitingElaboration, setAwaitingElaboration] = useState(false);

  useEffect(() => {
    const storedSession = JSON.parse(localStorage.getItem("session"));
    if (!storedSession) {
      setMessages([{ id: 1, type: "ai", content: "No session found. Please create a session first." }]);
      return;
    }

    const role = storedSession.role || "Frontend Developer";
    const roleQuestions = questionBank[role] || questionBank["Frontend Developer"];
    const roleKeywords = keywordsBank[role] || keywordsBank["Frontend Developer"];

    // Randomly pick one question from each group of 3 and grab corresponding keywords
    const chosenQs = [];
    const chosenKeywords = [];
    for (let i = 0; i < roleQuestions.length; i++) {
      const group = roleQuestions[i];
      const chosenIndex = Math.floor(Math.random() * group.length);
      chosenQs.push(group[chosenIndex]);
      chosenKeywords.push(roleKeywords[i][chosenIndex] || []);
    }

    setSelectedQuestions(chosenQs);
    setSelectedKeywords(chosenKeywords);

    setMessages([
      {
        id: Date.now(),
        type: "ai",
        content: `Hello! I reviewed your resume (${storedSession.resumeFile?.name || "resume.pdf"}) and job description (${storedSession.jobDescFile?.name || "jobdesc.txt"}). Let's begin your ${role} interview.`
      },
      {
        id: Date.now() + 1,
        type: "ai",
        content: `Question 1: ${chosenQs[0]}`
      }
    ]);
    // reset any previous state
    setQuestionIndex(0);
    setAwaitingElaboration(false);
  }, [sessionId]);

  const pushMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  // Normalize text for matching
  const normalize = (text) => (text || "").toString().toLowerCase();

  // Check which keywords are present in an answer
  const evaluateKeywords = (answerText, keywords = []) => {
    const found = [];
    const missing = [];
    const low = normalize(answerText);

    keywords.forEach((k) => {
      const key = k.toLowerCase();
      // check whole word or phrase presence
      if (low.includes(key)) {
        found.push(k);
      } else {
        // also check individual words of keyword e.g., "useEffect" vs "use effect"
        const parts = key.split(/\s+/).filter(Boolean);
        const anyPartFound = parts.some((p) => low.includes(p));
        if (anyPartFound) {
          found.push(k);
        } else {
          missing.push(k);
        }
      }
    });

    return { found, missing };
  };

  // Create a friendly feedback message listing present vs missing key points and suggestions
  const buildKeypointFeedback = (role, qIndex, answerText) => {
    const keywords = selectedKeywords[qIndex] || [];
    if (!keywords.length) {
      return "Good answer. Try to include specific examples or metrics next time to strengthen it.";
    }
    const { found, missing } = evaluateKeywords(answerText, keywords);

    let feedback = "";

    if (found.length) {
      feedback += `Key points identified in your answer: ${found.join(", ")}.\n\n`;
    } else {
      feedback += `No clear key points from the expected list were detected in your answer.\n\n`;
    }

    if (missing.length) {
      feedback += `Missing key points that were expected for this role: ${missing.join(", ")}.\n\n`;
      feedback += `Suggestion: Please try to include these points when answering — you can mention examples, tools, or short code/command snippets where relevant.`;
    } else {
      feedback += `Excellent — you covered the expected key points. Well explained!`;
    }

    return feedback;
  };

  const handleSend = () => {
    const text = userInput.trim();
    if (!text) return;

    // Add user message
    const userMsg = { id: Date.now(), type: "user", content: text };
    pushMessage(userMsg);

    const storedSession = JSON.parse(localStorage.getItem("session"));
    const role = (storedSession && storedSession.role) || "Frontend Developer";

    // If we are waiting for elaboration for the current question
    if (awaitingElaboration) {
      // Check if user elaborated sufficiently
      const wordCount = text.split(/\s+/).filter(Boolean).length;

      if (wordCount < WORD_THRESHOLD_ELABORATION) {
        // Still too short — ask to elaborate more
        setTimeout(() => {
          pushMessage({
            id: Date.now() + 1,
            type: "ai",
            content:
              "Thanks — that helps a bit. Could you please provide more details or an example (mention tools/libs or steps you used)? Try to write at least a couple of sentences."
          });
        }, 700);

        setUserInput("");
        return;
      }

      // Evaluate keypoints and give feedback
      setTimeout(() => {
        const evaluation = buildKeypointFeedback(role, questionIndex, text);

        // AI detailed feedback (keypoints + role-specific tips)
        pushMessage({
          id: Date.now() + 2,
          type: "ai",
          content:
            `${evaluation}\n\nDetailed feedback: ${
              /* choose a constructive sentence depending on role and q index */
              `Good structure — highlight challenges you faced and how you resolved them, and mention measurable outcomes (e.g., improved performance by X%).`
            }`
        });

        // After giving feedback, proceed to next question or finish
        if (questionIndex + 1 < selectedQuestions.length) {
          // send next question
          setTimeout(() => {
            pushMessage({
              id: Date.now() + 3,
              type: "ai",
              content: `Question ${questionIndex + 2}: ${selectedQuestions[questionIndex + 1]}`
            });
            setQuestionIndex((prev) => prev + 1);
            setAwaitingElaboration(false);
          }, 800);
        } else {
          // finish
          setTimeout(() => {
            pushMessage({
              id: Date.now() + 4,
              type: "ai",
              content: `🎉 Great job — you've completed the interview session for ${role}! ${motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}`
            });
            setAwaitingElaboration(false);
          }, 800);
        }
      }, 800);

      setUserInput("");
      return;
    }

    // Not awaiting elaboration: evaluate initial answer length
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words < WORD_THRESHOLD_SHORT) {
      // Ask for elaboration and set awaiting flag (don't advance question)
      setAwaitingElaboration(true);

      setTimeout(() => {
        pushMessage({
          id: Date.now() + 1,
          type: "ai",
          content:
            "Please clarify your points more — try elaborating with examples, steps you took, tools used, or reasoning. (Provide a few sentences so I can give detailed feedback.)"
        });
      }, 700);

      setUserInput("");
      return;
    }

    // Otherwise, the answer is sufficiently long: give feedback with keypoints and proceed
    setTimeout(() => {
      const evaluation = buildKeypointFeedback(role, questionIndex, text);

      pushMessage({
        id: Date.now() + 1,
        type: "ai",
        content:
          `${evaluation}\n\nFeedback: ${
            // general constructive feedback sentence
            "Good depth — include references to performance, testing, or metrics when possible."
          }`
      });

      if (questionIndex + 1 < selectedQuestions.length) {
        setTimeout(() => {
          pushMessage({
            id: Date.now() + 2,
            type: "ai",
            content: `Question ${questionIndex + 2}: ${selectedQuestions[questionIndex + 1]}`
          });
          setQuestionIndex((prev) => prev + 1);
        }, 800);
      } else {
        setTimeout(() => {
          pushMessage({
            id: Date.now() + 3,
            type: "ai",
            content: `🎉 Great job — you've completed the interview session for ${role}! ${motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}`
          });
        }, 800);
      }
    }, 700);

    setUserInput("");
  };

  if (!messages.length) return <p>Loading...</p>;

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[75vh] bg-gray-50 rounded-xl p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 mb-4 ${
              msg.type === "ai" ? "justify-start" : "justify-end"
            }`}
          >
            {msg.type === "ai" && (
              <div className="w-10 h-10 flex items-center justify-center bg-gray-400 rounded-full text-white text-xl">
                🤖
              </div>
            )}
            <div
              className={`p-3 max-w-[70%] rounded-xl break-words whitespace-pre-wrap ${
                msg.type === "ai"
                  ? "bg-white text-gray-800"
                  : "bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-white"
              }`}
            >
              {msg.content}
            </div>
            {msg.type === "user" && (
              <div className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden border border-gray-300">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 text-xl">👤</span>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="flex mt-auto gap-3">
          <input
            type="text"
            placeholder={
              awaitingElaboration
                ? "Please elaborate your previous answer (give examples, steps, tools)..."
                : "Type your answer..."
            }
            className="flex-[3] p-3 border border-gray-300 rounded-xl outline-none"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="flex-[1] btn-primary px-2 py-3 text-sm"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
