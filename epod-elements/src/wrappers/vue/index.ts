import { defineComponent, h, ref, onMounted, onUnmounted, watch } from 'vue';
import '../index';

export interface EpodListProps {
    token?: string;
    baseUrl?: string;
    pageSize?: number;
    statusFilter?: string;
}

export const EpodList = defineComponent<EpodListProps>({
    name: 'EpodList',
    props: {
        token: String,
        baseUrl: String,
        pageSize: Number,
        statusFilter: String,
    },
    emits: ['select', 'error'],
    setup(props, { emit }) {
        const containerRef = ref<HTMLElement | null>(null);
        let el: HTMLElement | null = null;

        function createElement() {
            if (!containerRef.current) return;
            containerRef.current.innerHTML = '';

            el = document.createElement('shipzy-epod-list');
            if (props.token) el.setAttribute('token', props.token);
            if (props.baseUrl) el.setAttribute('base-url', props.baseUrl);
            if (props.pageSize) el.setAttribute('page-size', String(props.pageSize));
            if (props.statusFilter) el.setAttribute('status-filter', props.statusFilter);

            el.addEventListener('epod-select', (e: Event) => {
                emit('select', (e as CustomEvent).detail.epodId);
            });
            el.addEventListener('error', (e: Event) => {
                emit('error', (e as CustomEvent).detail);
            });

            containerRef.current.appendChild(el);
        }

        onMounted(createElement);
        onUnmounted(() => { if (el) el.remove(); });

        watch(() => [props.token, props.baseUrl, props.pageSize, props.statusFilter], createElement);

        return () => h('div', { ref: containerRef });
    },
});

export interface EpodDetailProps {
    token?: string;
    baseUrl?: string;
    epodId: string;
}

export const EpodDetail = defineComponent<EpodDetailProps>({
    name: 'EpodDetail',
    props: {
        token: String,
        baseUrl: String,
        epodId: { type: String, required: true },
    },
    emits: ['sign-url-generated', 'error'],
    setup(props, { emit }) {
        const containerRef = ref<HTMLElement | null>(null);
        let el: HTMLElement | null = null;

        function createElement() {
            if (!containerRef.current) return;
            containerRef.current.innerHTML = '';

            el = document.createElement('shipzy-epod-detail');
            if (props.token) el.setAttribute('token', props.token);
            if (props.baseUrl) el.setAttribute('base-url', props.baseUrl);
            el.setAttribute('epod-id', props.epodId);

            el.addEventListener('sign-url-generated', (e: Event) => {
                emit('sign-url-generated', (e as CustomEvent).detail);
            });
            el.addEventListener('error', (e: Event) => {
                emit('error', (e as CustomEvent).detail);
            });

            containerRef.current.appendChild(el);
        }

        onMounted(createElement);
        onUnmounted(() => { if (el) el.remove(); });

        watch(() => [props.token, props.baseUrl, props.epodId], createElement);

        return () => h('div', { ref: containerRef });
    },
});

export interface EpodCreateProps {
    token?: string;
    baseUrl?: string;
    orderId?: string;
}

export const EpodCreate = defineComponent<EpodCreateProps>({
    name: 'EpodCreate',
    props: {
        token: String,
        baseUrl: String,
        orderId: String,
    },
    emits: ['created', 'error'],
    setup(props, { emit }) {
        const containerRef = ref<HTMLElement | null>(null);
        let el: HTMLElement | null = null;

        function createElement() {
            if (!containerRef.current) return;
            containerRef.current.innerHTML = '';

            el = document.createElement('shipzy-epod-create');
            if (props.token) el.setAttribute('token', props.token);
            if (props.baseUrl) el.setAttribute('base-url', props.baseUrl);
            if (props.orderId) el.setAttribute('order-id', props.orderId);

            el.addEventListener('created', (e: Event) => {
                emit('created', (e as CustomEvent).detail.epodId);
            });
            el.addEventListener('error', (e: Event) => {
                emit('error', (e as CustomEvent).detail);
            });

            containerRef.current.appendChild(el);
        }

        onMounted(createElement);
        onUnmounted(() => { if (el) el.remove(); });

        watch(() => [props.token, props.baseUrl, props.orderId], createElement);

        return () => h('div', { ref: containerRef });
    },
});
