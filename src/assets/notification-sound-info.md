# Notification Sound

## Como adicionar o som de notificação

### Opção 1: Usar um arquivo MP3 existente
1. Baixe um som de notificação (ex: de https://notificationsounds.com/)
2. Renomeie para `notification.mp3`
3. Coloque na pasta `src/assets/`

### Opção 2: Usar som do sistema (implementado)
O código já está configurado para usar um beep gerado via Web Audio API como fallback.

### Opção 3: Sons recomendados gratuitos
- https://notificationsounds.com/notification-sounds/
- https://mixkit.co/free-sound-effects/notification/
- https://freesound.org/

### Formato recomendado
- MP3 ou OGG
- Duração: 0.5 - 2 segundos
- Volume moderado
- Tamanho: < 50KB

## Implementação atual
O serviço de notificações tenta tocar `assets/notification.mp3` e, se falhar, usa um beep gerado programaticamente.
