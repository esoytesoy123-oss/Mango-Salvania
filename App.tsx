import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FinancialData {
    companyName: string;
    date: string;
    incomeStatement: {
        revenue: number;
        ingredients: { name: string; amount: number }[];
        operations: { name: string; amount: number }[];
        totalExpenses: number;
        profit: number;
    };
    cashFlow: {
        cashFromOperations: number;
        expensePaid: number;
        netCashFromOperations: number;
        cashFromInvestments: number;
        cashFromFinancing: number;
        startingCash: number;
        endingCash: number;
    };
    balanceSheet: {
        assets: number;
        liabilities: number;
        ownersEquity: number;
    };
}

const App: React.FC = () => {
    const [data, setData] = useState<FinancialData>({
        companyName: 'Mango Salvania',
        date: new Date().toISOString().split('T')[0],
        incomeStatement: {
            revenue: 10740,
            ingredients: [],
            operations: [],
            totalExpenses: 8631,
            profit: 2109,
        },
        cashFlow: {
            cashFromOperations: 10740,
            expensePaid: 8631,
            netCashFromOperations: 2109,
            cashFromInvestments: 0,
            cashFromFinancing: 4829,
            startingCash: 871,
            endingCash: 7809,
        },
        balanceSheet: {
            assets: 7089,
            liabilities: 2109,
            ownersEquity: 5700,
        },
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const saved = await AsyncStorage.getItem('financialData');
            if (saved)
                setData(JSON.parse(saved));
        } catch (error) {
            console.error('Load error:', error);
        }
    };

    const saveData = async (newData: FinancialData) => {
        try {
            await AsyncStorage.setItem('financialData', JSON.stringify(newData));
            setData(newData);
        } catch (error) {
            Alert.alert('Error', 'Failed to save data');
        }
    };

    const addIngredient = () => {
        const newData = { ...data };
        newData.incomeStatement.ingredients.push({ name: '', amount: 0 });
        saveData(newData);
    };

    const removeIngredient = (index: number) => {
        const newData = { ...data };
        newData.incomeStatement.ingredients.splice(index, 1);
        saveData(newData);
    };

    const addOperation = () => {
        const newData = { ...data };
        newData.incomeStatement.operations.push({ name: '', amount: 0 });
        saveData(newData);
    };

    const removeOperation = (index: number) => {
        const newData = { ...data };
        newData.incomeStatement.operations.splice(index, 1);
        saveData(newData);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>📊 Financial Tracker</Text>
            <Text style={styles.subtitle}>{data.companyName}</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Company Info</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Company Name'
                    value={data.companyName}
                    onChangeText={(text) => {
                        const newData = { ...data, companyName: text };
                        saveData(newData);
                    }}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Date (YYYY-MM-DD)'
                    value={data.date}
                    onChangeText={(text) => {
                        const newData = { ...data, date: text };
                        saveData(newData);
                    }}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📈 Income Statement</Text>
                <Text style={styles.label}>Revenue: ${data.incomeStatement.revenue.toLocaleString()}</Text>

                <Text style={styles.subTitle}>🥘 Ingredients</Text>
                {data.incomeStatement.ingredients.map((item, i) => (
                    <View key={i} style={styles.row}>
                        <TextInput
                            style={[styles.input, styles.flex]}
                            placeholder='Name'
                            value={item.name}
                            onChangeText={(text) => {
                                const newData = { ...data };
                                newData.incomeStatement.ingredients[i].name = text;
                                saveData(newData);
                            }}
                        />
                        <TextInput
                            style={[styles.input, styles.amountInput]}
                            placeholder='$'
                            keyboardType='decimal-pad'
                            value={item.amount.toString()}
                            onChangeText={(text) => {
                                const newData = { ...data };
                                newData.incomeStatement.ingredients[i].amount = parseFloat(text) || 0;
                                saveData(newData);
                            }}
                        />
                        <TouchableOpacity style={styles.deleteBtn} onPress={() => removeIngredient(i)}>
                            <Text style={styles.deleteText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity style={styles.addBtn} onPress={addIngredient}>
                    <Text style={styles.addText}>+ Add Ingredient</Text>
                </TouchableOpacity>

                <Text style={styles.subTitle}>⚙️ Operations</Text>
                {data.incomeStatement.operations.map((item, i) => (
                    <View key={i} style={styles.row}>
                        <TextInput
                            style={[styles.input, styles.flex]}
                            placeholder='Name'
                            value={item.name}
                            onChangeText={(text) => {
                                const newData = { ...data };
                                newData.incomeStatement.operations[i].name = text;
                                saveData(newData);
                            }}
                        />
                        <TextInput
                            style={[styles.input, styles.amountInput]}
                            placeholder='$'
                            keyboardType='decimal-pad'
                            value={item.amount.toString()}
                            onChangeText={(text) => {
                                const newData = { ...data };
                                newData.incomeStatement.operations[i].amount = parseFloat(text) || 0;
                                saveData(newData);
                            }}
                        />
                        <TouchableOpacity style={styles.deleteBtn} onPress={() => removeOperation(i)}>
                            <Text style={styles.deleteText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity style={styles.addBtn} onPress={addOperation}>
                    <Text style={styles.addText}>+ Add Operation</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Total Expenses: ${data.incomeStatement.totalExpenses.toLocaleString()}</Text>
                <Text style={styles.profit}>Net Profit: ${data.incomeStatement.profit.toLocaleString()}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>💰 Cash Flow Statement</Text>
                <Text style={styles.label}>Cash from Operations: ${data.cashFlow.cashFromOperations.toLocaleString()}</Text>
                <Text style={styles.label}>Expenses Paid: ${data.cashFlow.expensePaid.toLocaleString()}</Text>
                <Text style={styles.label}>Net Cash from Operations: ${data.cashFlow.netCashFromOperations.toLocaleString()}</Text>
                <Text style={styles.label}>Cash from Investments: ${data.cashFlow.cashFromInvestments.toLocaleString()}</Text>
                <Text style={styles.label}>Cash from Financing: ${data.cashFlow.cashFromFinancing.toLocaleString()}</Text>
                <Text style={styles.label}>Starting Cash: ${data.cashFlow.startingCash.toLocaleString()}</Text>
                <Text style={styles.profit}>Ending Cash: ${data.cashFlow.endingCash.toLocaleString()}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📋 Balance Sheet</Text>
                <View style={styles.balanceRow}>
                    <View style={styles.balanceCol}>
                        <Text style={styles.subTitle}>Assets</Text>
                        <Text style={styles.profit}>${data.balanceSheet.assets.toLocaleString()}</Text>
                    </View>
                    <View style={styles.balanceCol}>
                        <Text style={styles.subTitle}>Liabilities + OE</Text>
                        <Text style={styles.label}>Liabilities: ${data.balanceSheet.liabilities.toLocaleString()}</Text>
                        <Text style={styles.label}>Owners Equity: ${data.balanceSheet.ownersEquity.toLocaleString()}</Text>
                        <Text style={styles.profit}>${(data.balanceSheet.liabilities + data.balanceSheet.ownersEquity).toLocaleString()}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5', },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 4, color: '#333', },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 16, },
    section: { backgroundColor: '#fff', padding: 16, marginBottom: 16, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#2c3e50', },
    subTitle: { fontSize: 14, fontWeight: '500', marginTop: 10, marginBottom: 8, color: '#34495e', },
    label: { fontSize: 13, color: '#555', marginVertical: 4, },
    profit: { fontSize: 14, fontWeight: 'bold', color: '#27ae60', marginVertical: 6, },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginVertical: 6, borderRadius: 6, fontSize: 13, },
    row: { flexDirection: 'row', alignItems: 'center', marginVertical: 6, },
    flex: { flex: 1, },
    amountInput: { width: 80, marginHorizontal: 8, },
    addBtn: { backgroundColor: '#27ae60', padding: 12, borderRadius: 6, marginVertical: 8, alignItems: 'center', },
    addText: { color: '#fff', fontWeight: '600', fontSize: 13, },
    deleteBtn: { backgroundColor: '#e74c3c', padding: 8, borderRadius: 4, marginLeft: 8, },
    deleteText: { color: '#fff', fontWeight: 'bold', fontSize: 14, },
    balanceRow: { flexDirection: 'row', justifyContent: 'space-between', },
    balanceCol: { flex: 1, marginHorizontal: 8, },
});

export default App