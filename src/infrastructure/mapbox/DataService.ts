import Papa from 'papaparse';

export class DataService {
  private csvData: any[] = [];

  async loadCSVData(csvUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: (results) => {
          this.csvData = results.data;
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  getCSVData(): any[] {
    return this.csvData;
  }

  // Regrouper les données par canton et calculer une métrique (ex : moyenne H5N1)
  calculateMetricPerCanton(): Record<string, number> {
    const cantonMetrics: Record<string, { count: number, total: number }> = {};

    this.csvData.forEach(item => {
      const { H5N1, canton } = item; // Canton devrait être dans les données CSV
      const h5n1Value = parseFloat(H5N1) || 0;

      if (!cantonMetrics[canton]) {
        cantonMetrics[canton] = { count: 0, total: 0 };
      }

      cantonMetrics[canton].count += 1;
      cantonMetrics[canton].total += h5n1Value;
    });

    // Calculer la moyenne par canton
    const metricPerCanton: Record<string, number> = {};
    Object.keys(cantonMetrics).forEach(canton => {
      metricPerCanton[canton] = cantonMetrics[canton].total / cantonMetrics[canton].count;
    });

    return metricPerCanton;
  }
}
