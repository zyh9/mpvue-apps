<template>
    <map id="myMap" :longitude="116.451028" :latitude="39.949643" scale="13" :markers="markers" :polyline="polyline"></map>
</template>

<script>
    import gdMap from '../../utils/amap-wx.js';
    // console.log(gdMap)
    export default {
        data() {
            return {
                markers: [{
                    iconPath: "../../../static/add.png",
                    id: 0,
                    latitude: 39.989643,
                    longitude: 116.481028,
                    width: 30,
                    height: 30
                }, {
                    iconPath: "../../../static/add.png",
                    id: 0,
                    latitude: 39.90816,
                    longitude: 116.434446,
                    width: 30,
                    height: 30
                }],
                polyline: []
            }
        },
        onLoad() {
            let myAmapFun = new gdMap.AMapWX({
                key: '801939221fec22a5fd38c25dfd8b2e97'
            })
            myAmapFun.getWalkingRoute({
                origin: '116.481028,39.989643',
                destination: '116.434446,39.90816',
                success: data=> {
                    var points = [];
                    if (data.paths && data.paths[0] && data.paths[0].steps) {
                        var steps = data.paths[0].steps;
                        for (var i = 0; i < steps.length; i++) {
                            var poLen = steps[i].polyline.split(';');
                            for (var j = 0; j < poLen.length; j++) {
                                points.push({
                                    longitude: parseFloat(poLen[j].split(',')[0]),
                                    latitude: parseFloat(poLen[j].split(',')[1])
                                })
                            }
                        }
                    }
                    this.polyline = [{
                        points: points,
                        color: "#0091ff",
                        width: 6
                    }]
                    console.log(data)
                },
                fail: info=> {}
            })
        },
        components: {}
    }
</script>

<style lang="less">
    map {
        width: 100%;
        height: 100%;
    }
</style>
