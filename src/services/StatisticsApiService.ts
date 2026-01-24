import { api } from './api';
import type { StatisticsDto, StatisticsSummaryDto, DailyStatisticsDto } from '../types/Statistics';

export const getStatistics = async (startDate?: string, endDate?: string): Promise<StatisticsDto> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/statistics?${params.toString()}`);
    return response.data;
};

export const getStatisticsSummary = async (startDate?: string, endDate?: string): Promise<StatisticsSummaryDto> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/statistics/summary?${params.toString()}`);
    return response.data;
};

export const getDailyStatistics = async (startDate?: string, endDate?: string): Promise<DailyStatisticsDto[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/statistics/daily?${params.toString()}`);
    return response.data;
};
