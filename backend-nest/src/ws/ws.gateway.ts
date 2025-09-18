import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ 
  cors: { 
    origin: [
      'http://localhost:5173',
      'https://messaging-system-navy.vercel.app',
      'https://messaging-system-n0wz.onrender.com'
    ], 
    credentials: true 
  } 
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Set<string>();

  constructor(private readonly jwtService: JwtService) {
    // expose instance for external emits
    wsGatewayInstance = this;
  }

  handleConnection(client: Socket) {
    const userId = this.extractUserIdFromClient(client);
    if (userId) {
      client.join(String(userId));
      this.onlineUsers.add(String(userId));
      this.server.emit('getOnlineUsers', Array.from(this.onlineUsers));
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.extractUserIdFromClient(client);
    if (userId && this.onlineUsers.delete(String(userId))) {
      this.server.emit('getOnlineUsers', Array.from(this.onlineUsers));
    }
  }

  private extractUserIdFromClient(client: Socket): string | null {
    try {
      const cookie = client.handshake.headers?.cookie || '';
      const token = cookie.split(';').map((c) => c.trim()).find((c) => c.startsWith('token='))?.split('=')[1];
      if (!token) return null;
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      return payload?.sub ? String(payload.sub) : null;
    } catch (e) {
      return null;
    }
  }
}

export let wsGatewayInstance: WsGateway | null = null;
export const emitToUser = (userId: string, event: string, payload: any) => {
  if (wsGatewayInstance?.server) {
    wsGatewayInstance.server.to(String(userId)).emit(event, payload);
  }
};
