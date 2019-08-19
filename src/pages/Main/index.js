import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

import Header from '~/components/Header';
import Tabs from '~/components/Tabs';
import Menu from '~/components/Menu';

import {
  Container,
  Content,
  Card, CardHeader, CardHeaderTitle, CardContent, CardFooter,
  Title, Description, DescriptionBold, DescriptionFooter, DescriptionFooterValue, Annotation, SafeAreaView,
} from './styles';

export default function Main() {
  let offset = 0;
  const translateY = new Animated.Value(0);

  const animatedEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true },
  );

  function onHandlerStateChanged(event) {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let opened = false;
      const { translationY } = event.nativeEvent;

      offset += translationY;

      if (translationY >= 100) {
        opened = true;
      } else {
        translateY.setValue(offset);
        translateY.setOffset(0);
        offset = 0;
      }

      Animated.timing(translateY, {
        toValue: opened ? 380 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        offset = opened ? 380 : 0;
        translateY.setOffset(offset);
        translateY.setValue(0);
      });
    }
  }

  return (
    <SafeAreaView>
      <Container>
        <Header />
        <Content>
          <Menu translateY={translateY} />

          <PanGestureHandler
            onGestureEvent={animatedEvent}
            onHandlerStateChange={onHandlerStateChanged}
          >
            <Card style={{
              transform: [{
                translateY: translateY.interpolate({
                  inputRange: [-350, 0, 380],
                  outputRange: [-50, 0, 380],
                  extrapolate: 'clamp',
                }),
              }],
            }}
            >
              <CardHeader>
                <Icon name="payment" size={28} color="#666" />
                <CardHeaderTitle>Cartão de Crédito</CardHeaderTitle>
              </CardHeader>

              <CardContent>
                <Title>Fatura Atual</Title>
                <Description style={{fontWeight: '100'}}>R$ <DescriptionBold style={{fontWeight: 'bold'}}>200.611</DescriptionBold>,65</Description>
                <DescriptionFooter>Limite Disponível <DescriptionFooterValue> R$ 4,04</DescriptionFooterValue></DescriptionFooter>
              </CardContent>

              <CardFooter>
                <Annotation>
                  <Icon name="store" size={28} color="#666" /> Compra mais recente em Adubras no valor de R$ 900,00 (Quarta)
                </Annotation>
              </CardFooter>

            </Card>
          </PanGestureHandler>

        </Content>

        <Tabs translateY={translateY} />
      </Container>
    </SafeAreaView>
  );
}
