export type S3Response = {
    AccountId: string,
    Categories: {
        MatchedCategories: string[],
        MatchedDetails: {
            climate_change_interest: {
                PointsOfInterest: any []
            }
        }
    },
    Channel: string,
    ContentMetadata: {
        Output: string
    },
    ConversationCharacteristics: {
        Interruptions: {
            InterruptionsByInterrupter: {
                CUSTOMER: any []
            },
            TotalCount: number,
            TotalTimeMillis: number
        },
        NonTalkTime: {
            Instances: any [],
            TotalTimeMillis: number
        },
        Sentiment: {
            OverallSentiment: {
                AGENT: number,
                CUSTOMER: number
            },
            SentimentByPeriod: {
                QUARTER: {
                    AGENT: any []
                }
            }
        },
        TalkSpeed: {
            DetailsByParticipant: {
                AGENT: {
                    AverageWordsPerMinute: number
                },
                CUSTOMER: {
                    AverageWordsPerMinute: number
                }
            }
        },
        TalkTime: {
            DetailsByParticipant: {
                AGENT: {
                    TotalTimeMillis: number
                },
                CUSTOMER: {
                    TotalTimeMillis: number
                }
            },
            TotalTimeMillis: number
        },
        TotalConversationDurationMillis: number
    },
    CustomerMetadata: {
        InputS3Uri: string,
        ContactId: string,
        InstanceId: string,
    },
    CustomModels: [],
    JobStatus: string,
    LanguageCode: string,
    Participants: any [],
    Transcript: any[]
    Version: string
}