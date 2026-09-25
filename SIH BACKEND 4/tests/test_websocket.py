import json
from starlette.testclient import TestClient
from app.main import app


def test_websocket_live_connection_and_ping():
    client = TestClient(app)
    with client.websocket_connect("/live?role=admin&user_id=TEST_OFFICER_1") as websocket:
        # 1. First message should be the CONNECTED welcome frame
        data = websocket.receive_text()
        frame = json.loads(data)
        assert frame["event"] == "CONNECTED"
        assert "notifications:admin" in frame["subscribed_channels"]
        assert "notifications:user:TEST_OFFICER_1" in frame["subscribed_channels"]

        # 2. Test ping -> pong
        websocket.send_text(json.dumps({"action": "ping"}))
        pong_data = websocket.receive_text()
        pong_frame = json.loads(pong_data)
        assert pong_frame["event"] == "pong"
        assert "timestamp" in pong_frame


def test_websocket_subscribe_and_broadcast():
    client = TestClient(app)
    with client.websocket_connect("/live") as websocket:
        # Welcome frame
        welcome = json.loads(websocket.receive_text())
        assert welcome["event"] == "CONNECTED"

        # Subscribe to custom channel
        websocket.send_text(json.dumps({
            "action": "subscribe",
            "channel": "civic:water_alerts"
        }))
        sub_resp = json.loads(websocket.receive_text())
        assert sub_resp["event"] == "SUBSCRIBED"
        assert sub_resp["channel"] == "civic:water_alerts"

        # Broadcast on the subscribed channel
        websocket.send_text(json.dumps({
            "action": "broadcast",
            "channel": "civic:water_alerts",
            "payload": {"alert": "Valve repaired"}
        }))
        broadcast_msg = json.loads(websocket.receive_text())
        assert broadcast_msg["event"] == "MESSAGE"
        assert broadcast_msg["channel"] == "civic:water_alerts"
        assert broadcast_msg["payload"]["alert"] == "Valve repaired"


def test_websocket_unsubscribe():
    client = TestClient(app)
    with client.websocket_connect("/live") as websocket:
        # Welcome frame
        websocket.receive_text()

        websocket.send_text(json.dumps({
            "action": "unsubscribe",
            "channel": "public"
        }))
        unsub_resp = json.loads(websocket.receive_text())
        assert unsub_resp["event"] == "UNSUBSCRIBED"
        assert unsub_resp["channel"] == "public"
