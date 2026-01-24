export interface DateRangeDto {
    startDate: string;
    endDate: string;
}

export interface StatisticsSummaryDto {
    totalUsers: number;
    totalEvents: number;
    totalSessions: number;
    totalRegistrations: number;
    newUsersInRange: number;
    eventsInRange: number;
    sessionsInRange: number;
}

export interface DailyStatisticsDto {
    date: string;
    events: number;
    sessions: number;
    registrations: number;
    users: number;
}

export interface StatisticsDto {
    dateRange: DateRangeDto;
    summary: StatisticsSummaryDto;
    dailyData: DailyStatisticsDto[];
}
