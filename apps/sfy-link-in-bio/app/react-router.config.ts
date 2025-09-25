import type { Config } from '@react-router/dev/config';

export default {
	appDirectory: 'src',
	buildDirectory: 'build',
	future: {
		v8_middleware: true
	}
} satisfies Config;
