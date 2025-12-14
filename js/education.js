// Education System
const Education = {
    state: {
        subjects: {},
        gradeAverage: 70,
        attendance: 100,
        exams: [],
        assignments: [],
        previousTier: null  // Track previous grade tier for notifications
    },
    
    // Subject definitions
    subjectList: ['math', 'science', 'english', 'history'],
    
    // Initialize education system
    init: function() {
        this.state.subjects = {};
        
        // Initialize all subjects
        for (const subject of this.subjectList) {
            this.state.subjects[subject] = {
                name: this.getSubjectDisplayName(subject),
                grade: 70,
                studyTime: 0,
                lastStudied: null
            };
        }
        
        this.state.gradeAverage = 70;
        this.state.attendance = 100;
        this.state.exams = [];
        this.state.assignments = [];
    },
    
    // Get subject display name
    getSubjectDisplayName: function(subject) {
        const names = {
            math: 'Mathematics',
            science: 'Science',
            english: 'English',
            history: 'History'
        };
        return names[subject] || subject;
    },
    
    // Study a subject
    study: function(subject, intelligenceBonus = 0) {
        if (!this.state.subjects[subject]) {
            return false;
        }
        
        const subjectData = this.state.subjects[subject];
        
        // Increase study time
        subjectData.studyTime += 1;
        subjectData.lastStudied = Game.state.progress.daysPlayed;
        
        // Calculate grade improvement (affected by intelligence)
        const baseImprovement = 2;
        const intelligenceMultiplier = 1 + (intelligenceBonus / 100);
        const improvement = baseImprovement * intelligenceMultiplier;
        
        // Apply improvement with diminishing returns
        const currentGrade = subjectData.grade;
        if (currentGrade < 90) {
            subjectData.grade = Math.min(100, currentGrade + improvement);
        } else {
            subjectData.grade = Math.min(100, currentGrade + improvement * 0.5);
        }
        
        return this.updateGradeAverage();
    },
    
    // Attend school day
    attendSchool: function() {
        // Slightly improve all subjects from attending class
        for (const subject of this.subjectList) {
            const subjectData = this.state.subjects[subject];
            if (subjectData.grade < 100) {
                subjectData.grade = Math.min(100, subjectData.grade + 0.5);
            }
        }
        
        return this.updateGradeAverage();
    },
    
    // Miss school day
    missSchool: function() {
        // Decrease attendance
        this.state.attendance = Math.max(0, this.state.attendance - 2);
        
        // Slightly decrease all grades
        for (const subject of this.subjectList) {
            const subjectData = this.state.subjects[subject];
            subjectData.grade = Math.max(0, subjectData.grade - 1);
        }
        
        return this.updateGradeAverage();
    },
    
    // Update overall grade average and check for tier changes
    updateGradeAverage: function() {
        let total = 0;
        let count = 0;
        
        for (const subject of this.subjectList) {
            const subjectData = this.state.subjects[subject];
            total += subjectData.grade;
            count++;
        }
        
        this.state.gradeAverage = count > 0 ? Math.round(total / count) : 0;
        
        // Check if tier changed and return notification info
        return this.checkTierChange();
    },
    
    // Get letter grade from percentage
    getLetterGrade: function(percentage) {
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 70) return 'C';
        if (percentage >= 60) return 'D';
        return 'F';
    },
    
    // Get lowest grade among all subjects
    getLowestGrade: function() {
        let lowestGrade = 100;
        
        for (const subject of this.subjectList) {
            const subjectData = this.state.subjects[subject];
            if (subjectData && subjectData.grade < lowestGrade) {
                lowestGrade = subjectData.grade;
            }
        }
        
        return lowestGrade;
    },
    
    // Get current grade tier based on lowest grade
    getCurrentTier: function() {
        const lowestGrade = this.getLowestGrade();
        return this.getLetterGrade(lowestGrade);
    },
    
    // Get actions per school day based on grade tier
    getActionsForGradeTier: function() {
        const tier = this.getCurrentTier();
        
        const actionsMap = {
            'A': 7,
            'B': 6,
            'C': 5,
            'D': 4,
            'F': 3
        };
        
        return actionsMap[tier] || 3;
    },
    
    // Get weekly allowance based on grade tier
    getAllowanceForGradeTier: function() {
        const tier = this.getCurrentTier();
        
        const allowanceMap = {
            'A': 25,
            'B': 20,
            'C': 15,
            'D': 10,
            'F': 5
        };
        
        return allowanceMap[tier] || 5;
    },
    
    // Check if tier has changed and return notification message
    checkTierChange: function() {
        const currentTier = this.getCurrentTier();
        const previousTier = this.state.previousTier;
        
        // Initialize previous tier on first check
        if (previousTier === null) {
            this.state.previousTier = currentTier;
            return null;
        }
        
        // Check if tier changed
        if (currentTier !== previousTier) {
            this.state.previousTier = currentTier;
            
            const lowestGrade = this.getLowestGrade();
            const actions = this.getActionsForGradeTier();
            const allowance = this.getAllowanceForGradeTier();
            
            return {
                tier: currentTier,
                lowestGrade: Math.round(lowestGrade),
                actions: actions,
                allowance: allowance,
                improved: this.tierComparison(currentTier, previousTier) > 0
            };
        }
        
        return null;
    },
    
    // Compare two tiers (returns positive if tier1 is better than tier2)
    tierComparison: function(tier1, tier2) {
        const tierValues = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 };
        return tierValues[tier1] - tierValues[tier2];
    },
    
    // Generate exam event
    generateExam: function() {
        const subject = this.subjectList[Math.floor(Math.random() * this.subjectList.length)];
        const subjectData = this.state.subjects[subject];
        
        return {
            text: `You have a ${subjectData.name} exam today!`,
            choices: [
                {
                    text: 'Take the exam',
                    effects: {},
                    callback: () => this.takeExam(subject)
                },
                {
                    text: 'Skip the exam',
                    effects: { happiness: 5, intelligence: -5 },
                    callback: () => {
                        this.state.subjects[subject].grade = Math.max(0, this.state.subjects[subject].grade - 10);
                        const tierChange = this.updateGradeAverage();
                        return { message: 'You skipped the exam.', tierChange: tierChange };
                    }
                }
            ]
        };
    },
    
    // Take an exam
    takeExam: function(subject) {
        const subjectData = this.state.subjects[subject];
        
        // Exam performance based on current grade and intelligence
        const baseScore = subjectData.grade;
        const intelligenceFactor = Game.state.stats.intelligence / 100;
        const randomFactor = (Math.random() * 20) - 10; // -10 to +10
        
        const examScore = Math.max(0, Math.min(100, 
            baseScore * (0.7 + intelligenceFactor * 0.3) + randomFactor
        ));
        
        // Update grade (exam counts for 30% of grade)
        subjectData.grade = Math.round(subjectData.grade * 0.7 + examScore * 0.3);
        
        const tierChange = this.updateGradeAverage();
        
        // Record exam
        this.state.exams.push({
            subject: subject,
            score: Math.round(examScore),
            date: Game.state.progress.daysPlayed
        });
        
        // Return result message
        const letterGrade = this.getLetterGrade(examScore);
        return {
            message: `You scored ${Math.round(examScore)}% (${letterGrade}) on the ${subjectData.name} exam!`,
            score: examScore,
            tierChange: tierChange
        };
    },
    
    // Generate assignment event
    generateAssignment: function() {
        const subject = this.subjectList[Math.floor(Math.random() * this.subjectList.length)];
        const subjectData = this.state.subjects[subject];
        
        return {
            text: `You have a ${subjectData.name} assignment due!`,
            choices: [
                {
                    text: 'Complete it carefully',
                    effects: { energy: -15, intelligence: 3 },
                    callback: () => {
                        const tierChange = this.completeAssignment(subject, 'high');
                        return { message: 'You carefully completed the assignment.', tierChange: tierChange };
                    }
                },
                {
                    text: 'Rush through it',
                    effects: { energy: -8, intelligence: 1 },
                    callback: () => {
                        const tierChange = this.completeAssignment(subject, 'medium');
                        return { message: 'You rushed through the assignment.', tierChange: tierChange };
                    }
                },
                {
                    text: 'Skip it',
                    effects: { happiness: 5 },
                    callback: () => {
                        const tierChange = this.completeAssignment(subject, 'none');
                        return { message: 'You skipped the assignment.', tierChange: tierChange };
                    }
                }
            ]
        };
    },
    
    // Complete assignment
    completeAssignment: function(subject, effort) {
        const subjectData = this.state.subjects[subject];
        
        let gradeChange = 0;
        let score = 0;
        
        if (effort === 'high') {
            gradeChange = 3;
            score = 90 + Math.random() * 10;
        } else if (effort === 'medium') {
            gradeChange = 1;
            score = 70 + Math.random() * 20;
        } else {
            gradeChange = -5;
            score = 0;
        }
        
        subjectData.grade = Math.max(0, Math.min(100, subjectData.grade + gradeChange));
        const tierChange = this.updateGradeAverage();
        
        this.state.assignments.push({
            subject: subject,
            score: Math.round(score),
            effort: effort,
            date: Game.state.progress.daysPlayed
        });
        
        return tierChange;
    },
    
    // Get all subjects
    getAllSubjects: function() {
        return Object.entries(this.state.subjects).map(([id, data]) => ({
            id: id,
            ...data
        }));
    },
    
    // Get state for saving
    getState: function() {
        return JSON.parse(JSON.stringify(this.state));
    },
    
    // Load state
    loadState: function(savedState) {
        this.state = JSON.parse(JSON.stringify(savedState));
    }
};
