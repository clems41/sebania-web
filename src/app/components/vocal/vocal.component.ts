import {Component, Input, OnDestroy, output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DialogModule} from 'primeng/dialog';
import {DateUtils} from '../../utils/date-utils';
import {VocalService} from '../../services/vocal.service';
import {MessageService} from 'primeng/api';
import {VocalType} from '../../models/vocal';

@Component({
  selector: 'app-vocal',
  imports: [
    ButtonModule,
    DialogModule
  ],
  templateUrl: './vocal.component.html'
})
export class VocalComponent implements OnDestroy {
  @Input() date: Date = new Date();
  @Input() vocalType: VocalType = VocalType.Taches;
  onVocalSent = output<number>();
  visible: boolean = false;

  // États d'enregistrement
  isRecording = false;
  hasRecording = false;
  isPlaying = false;
  isSending = false;
  isLoading = false;

  // Objets MediaRecorder et Audio
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioBlob: Blob | null = null;
  private audioUrl: string | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private stream: MediaStream | null = null;

  // Durées
  recordingDuration = 0;
  private recordingTimer: any;
  readonly MAX_DURATION = 300; // 5 minutes en secondes
  private readonly MIN_DURATION = 1; // 1 seconde minimum

  // Description
  tachesDescription = `
          Pour chaque tâche réalisée, indiquez les informations suivantes :
        <ul class="mt-1 ml-4">
          <li>• l'activité réalisée</li>
          <li>• la durée</li>
          <li>• les cultures concernées</li>
          <li>• les parcelles concernées</li>
          <li>• la ou les quantités si appliquable</li>
        </ul>
  `
  tachesTitree = "Racontez-moi votre journée"
  parcellesDescription = `
          Pour chaque parcelle, indiquez les informations suivantes :
        <ul class="mt-1 ml-4">
          <li>• type de parcelle (plein champ, serre, chapelle, tunnel, etc)</li>
          <li>• longueur</li>
          <li>• largeur</li>
          <li>• largeur de chaque planche</li>
          <li>• nombre de planches</li>
        </ul>
  `
  parcellesTitree = "Détaillez moi l'organisation de vos parcelles"

  constructor(
    protected dateUtils: DateUtils,
    private vocalService: VocalService,
    private messageService: MessageService
  ) {
  }

  ngOnDestroy() {
    this.cleanupResources();
  }

  async onAudioButtonClick() {
    if (this.isRecording) {
      this.stopRecording();
    } else if (!this.hasRecording) {
      await this.startRecording();
    }
  }

  private async startRecording() {
    try {
      // Demande de permission pour le microphone
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      // Réinitialisation
      this.audioChunks = [];
      this.recordingDuration = 0;

      // Configuration MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: this.getSupportedMimeType()
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.finalizeRecording();
      };

      // Démarrage de l'enregistrement
      this.mediaRecorder.start(100); // Collecte des données toutes les 100ms
      this.isRecording = true;

      // Timer pour la durée
      this.recordingTimer = setInterval(() => {
        this.recordingDuration++;
        if (this.recordingDuration >= this.MAX_DURATION) {
          this.stopRecording();
        }
      }, 1000);

    } catch (error) {
      this.handleRecordingError(error);
    }
  }

  private stopRecording() {
    this.isLoading = true;
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }

    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }

    this.isRecording = false;

    // Arrêt du stream
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  private finalizeRecording() {
    if (this.audioChunks.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Aucune donnée audio enregistrée'
      });
      return;
    }

    if (this.recordingDuration < this.MIN_DURATION) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Enregistrement trop court (minimum 1 seconde)'
      });
      this.resetRecording();
      return;
    }

    // Création du blob audio
    this.audioBlob = new Blob(this.audioChunks, {
      type: this.getSupportedMimeType()
    });

    // Création URL pour lecture
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
    this.audioUrl = URL.createObjectURL(this.audioBlob);

    this.hasRecording = true;
    this.isLoading = false;
  }

  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus'
    ];

    return types.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/webm';
  }

  private handleRecordingError(error: any) {
    console.error('Erreur d\'enregistrement:', error);

    if (error.name === 'NotAllowedError') {
      this.messageService.add({
        severity: 'error',
        summary: 'Permission refusée',
        detail: 'L\'accès au microphone est requis pour enregistrer un message vocal'
      });
    } else if (error.name === 'NotFoundError') {
      this.messageService.add({
        severity: 'error',
        summary: 'Microphone introuvable',
        detail: 'Aucun microphone n\'a été détecté sur votre appareil'
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur d\'enregistrement',
        detail: 'Une erreur est survenue lors de l\'enregistrement'
      });
    }

    this.resetRecording();
  }

  private cleanupResources() {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }

    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
  }

  private resetRecording() {
    this.hasRecording = false;
    this.isRecording = false;
    this.isPlaying = false;
    this.recordingDuration = 0;
    this.audioChunks = [];
    this.audioBlob = null;

    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = null;
    }
  }

  // Méthodes de contrôle audio
  playRecording() {
    if (!this.audioUrl) return;

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }

    this.audioElement = new Audio(this.audioUrl);
    this.audioElement.onplay = () => {
      this.isPlaying = true;
    };

    this.audioElement.onpause = () => {
      this.isPlaying = false;
    };

    this.audioElement.onended = () => {
      this.isPlaying = false;
    };

    this.audioElement.onerror = () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur de lecture',
        detail: 'Impossible de lire l\'enregistrement audio'
      });
      this.isPlaying = false;
    };

    this.audioElement.play().catch((error) => {
      console.error('Erreur de lecture:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur de lecture',
        detail: 'Impossible de lire l\'enregistrement audio'
      });
      this.isPlaying = false;
    });
  }

  pauseRecording() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  togglePlayback() {
    if (this.isPlaying) {
      this.pauseRecording();
    } else {
      this.playRecording();
    }
  }

  deleteRecording() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
    this.resetRecording();
  }

  sendRecording() {
    if (!this.audioBlob || this.isSending) return;

    this.isSending = true;

    this.vocalService.sendVocal(this.audioBlob, this.vocalType, this.date).subscribe({
      next: (vocal) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Votre message vocal a été envoyé avec succès'
        });

        // Fermer le dialog et réinitialiser
        this.visible = false;
        this.resetRecording();
        this.isSending = false;
        this.onVocalSent.emit(vocal.id);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur d\'envoi',
          detail: "Error lors de l'envoi du message vocal"
        });
        this.isSending = false;
      }
    });
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  protected readonly VocalType = VocalType;
}
