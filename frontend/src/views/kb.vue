<template>
    <main class="container mx-auto text-center">
        <section class="bg-white rounded-lg shadow-box">
            <iframe :src="source"
                    class="container mx-auto min-h-with-footer-header"></iframe>
        </section>
    </main>
</template>

<script>

export default {
    props: ['programId'],
    computed: {
        article() {
            return this.$route.query.article || ''
        },
        source() {
            let article = this.article ? `article/${this.article}` : ''
            let src = "https://amplio.my.site.com/help/s/" + article;
            return src;
        },
    },
}
</script>
