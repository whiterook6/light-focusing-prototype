export class PositionGizmo {
	private currentPos: { x: number; y: number } | null = null;
	private pinned: Array<{ x: number; y: number }> = [];
	private canvas: HTMLCanvasElement;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		window.addEventListener('mousemove', this.handleMouseMove);
		window.addEventListener('mousedown', this.handleMouseDown);
	}

	handleMouseMove = (event: MouseEvent) => {
		const rect = this.canvas.getBoundingClientRect();
		this.currentPos = {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
		};
	};

	handleMouseDown = (event: MouseEvent) => {
		if (this.currentPos) {
			this.pinned.push({ ...this.currentPos });
		}
	};

	render(context: CanvasRenderingContext2D) {
			context.save();
			context.font = '14px monospace';
			context.fillStyle = 'black';
			context.strokeStyle = 'black';
			// Helper to draw a tiny cross
			const drawCross = (x: number, y: number, size: number = 5) => {
				context.beginPath();
				context.moveTo(x - size, y);
				context.lineTo(x + size, y);
				context.moveTo(x, y - size);
				context.lineTo(x, y + size);
				context.stroke();
			};

			// Draw current position under cursor
			if (this.currentPos) {
				const { x, y } = this.currentPos;
				drawCross(x, y);
				context.fillText(`[${x.toFixed(0)}, ${y.toFixed(0)}]`, x + 10, y + 10);
			}
			// Draw pinned positions
			for (const pos of this.pinned) {
				drawCross(pos.x, pos.y);
				context.fillText(`[${pos.x.toFixed(0)}, ${pos.y.toFixed(0)}]`, pos.x + 10, pos.y + 10);
			}
			context.restore();
	}

	destroy() {
		window.removeEventListener('mousemove', this.handleMouseMove);
		window.removeEventListener('mousedown', this.handleMouseDown);
	}
}
