import React, { Component } from 'react'
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { getNewsList } from '../../utils/api'

export default class index extends Component {
    constructor() {
        super()
        this.state = {
            type: 'general',
            list: [],
            loading: false,
        }
    }

    componentDidMount() {
        this.getList()
    }

    getList = () => {
        const type = this.state.type
        this.setState({ loading: true })

        getNewsList(type)
            .then(res => {
                this.setState({
                    list: res,
                    loading: false,
                })
            })
            .catch(err => {
                this.setState({ loading: false })
                Alert.alert('Error', err.message || JSON.stringify(err))
            })
    }

    newsItem = ({ index, item }) => {
        if (item.urlToImage) {
            return this.newsItemWithImage({ index, item })
        }

        return this.newsItemNoImage({ index, item })
    }

    newsItemWithImage = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.newsItem}
                onPress={() => this.openNews(item.url)}
            >
                <Image
                    source={{ uri: item.urlToImage }}
                    style={styles.newsImage}
                />
                <View style={styles.newsContent}>
                    <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.newsDesc} numberOfLines={2}>{item.description}</Text>
                    <Text style={styles.newsSource} numberOfLines={1}>
                        {item.source?.name} · {formatDate(item.publishedAt)}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    newsItemNoImage = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.newsItemNoImage}
                onPress={() => this.openNews(item.url)}
            >
                <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.newsDesc} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.newsSource} numberOfLines={1}>
                    {item.source?.name} · {formatDate(item.publishedAt)}
                </Text>
            </TouchableOpacity>
        )
    }

    openNews = url => {
        if (!url) {
            return
        }

        Linking.openURL(url).catch(err => {
            Alert.alert('Error', JSON.stringify(err))
        })
    }

    render() {
        const { list, loading } = this.state

        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <View style={styles.loading}>
                        <ActivityIndicator color="white" />
                        <Text style={styles.loadingTitle}>Loading......</Text>
                    </View>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <FlatList
                    data={list}
                    renderItem={this.newsItem}
                    keyExtractor={(item, index) => `${item.url || item.title}-${index}`}
                    ListEmptyComponent={<Text style={styles.emptyText}>Do not have News</Text>}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loading: {
        backgroundColor: '#999',
        height: 100,
        width: 150,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingTitle: {
        color: 'white',
        marginTop: 10,
    },
    newsItem: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    newsImage: {
        width: 110,
        height: 80,
        borderRadius: 6,
        marginRight: 10,
        backgroundColor: '#eee',
    },
    newsContent: {
        flex: 1,
    },
    newsItemNoImage: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    newsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 6,
    },
    newsDesc: {
        fontSize: 14,
        color: '#555',
        marginBottom: 6,
    },
    newsSource: {
        fontSize: 12,
        color: '#888',
    },
    emptyText: {
        padding: 20,
        color: '#888',
        textAlign: 'center',
    },
})

function formatDate(value) {
    if (!value) {
        return ''
    }

    return new Date(value).toLocaleDateString()
}
