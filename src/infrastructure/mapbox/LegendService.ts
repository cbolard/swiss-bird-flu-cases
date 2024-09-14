export class LegendService {
  private readonly LEGEND_DATA = [
    { label: 'H5N1', color: 'rgba(255, 0, 0, 0.6)' },
    { label: 'H5N2', color: 'rgba(255, 165, 0, 0.6)' },
    { label: 'H7N2', color: 'rgba(255, 255, 0, 0.6)' },
    { label: 'H7N8', color: 'rgba(0, 255, 0, 0.6)' },
    { label: 'No Cases', color: 'rgba(0, 0, 0, 0.4)' }
  ];

  private readonly LEGEND_STYLES = {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '5px',
    fontSize: '12px',
    color: '#000',
  };

  constructor(private map: mapboxgl.Map) {}

  addLegend(): void {
    const legendContainer = this.createLegendContainer();
    legendContainer.innerHTML = this.buildLegendHtml();
    document.body.appendChild(legendContainer);
  }

  private createLegendContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'map-legend';

    Object.assign(container.style, this.LEGEND_STYLES);
    return container;
  }

  private buildLegendHtml(): string {
    const legendItemsHtml = this.LEGEND_DATA.map(item => this.buildLegendItem(item)).join('');
    return `
      <strong>Legend</strong><br>
      ${legendItemsHtml}
      <br>
      <strong>Circle Size:</strong> Indicates the total number of cases
    `;
  }

  private buildLegendItem({ label, color }: { label: string, color: string }): string {
    return `
      <span style="background-color: ${color}; width: 12px; height: 12px; display: inline-block; margin-right: 5px;"></span> ${label}<br>
    `;
  }
}
