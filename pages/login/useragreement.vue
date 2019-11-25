<template>
    <view>
        <web-view :webview-styles="webviewStyles" src="http://zn.yywkt.com/user.html"></web-view>
		<!-- <web-view :webview-styles="webviewStyles" src="http://zn.yywkt.com/nines/#/"></web-view> -->
		
    </view>
</template>

<script>
    export default {
        data() {
            return {
                webviewStyles: {
                    progress: {
                        color: '#33FF33'
                    }
                }
            }
        }
    }
</script>

<style>

</style>
