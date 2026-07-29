import wave
import math
import struct
import pathlib
import sys

def generate_145hz_tone(output_path, duration_sec=5.0, sample_rate=44100):
    """
    Generates a 145Hz sine wave (Tartini difference tone) 
    using pure Python standard libraries (wave, math, struct).
    """
    num_samples = int(sample_rate * duration_sec)
    freq = 145.0  # Tartini difference tone frequency
    
    with wave.open(str(output_path), 'w') as wav_file:
        # nchannels, sampwidth, framerate, nframes, comptype, compname
        wav_file.setparams((1, 2, sample_rate, num_samples, 'NONE', 'not compressed'))
        
        for i in range(num_samples):
            t = i / sample_rate
            # 145Hz tone with subtle 432Hz harmonic overlay
            tone = 0.8 * math.sin(2 * math.pi * freq * t) + 0.2 * math.sin(2 * math.pi * 432.0 * t)
            # Fade in/out to avoid clicks
            envelope = min(1.0, t / 0.5) * min(1.0, (duration_sec - t) / 0.5)
            sample = int(tone * envelope * 32767.0)
            wav_file.writeframes(struct.pack('<h', sample))
            
    print(f"[SUCCESS] Generated 145Hz Carrier Audio: {output_path}")

def embed_metadata(jpg_path, output_jpg_path, comment_str):
    """
    Embeds steganographic comment metadata directly into JPEG COM marker.
    """
    with open(jpg_path, 'rb') as f:
        data = f.read()

    # Find JPEG SOI marker (0xFF, 0xD8)
    if not data.startswith(b'\xff\xd8'):
        raise ValueError("Not a valid JPEG file")

    # Construct JPEG COM marker: 0xFF, 0xFE, length (2 bytes), data
    comment_bytes = comment_str.encode('utf-8')
    comment_length = len(comment_bytes) + 2
    com_marker = b'\xff\xfe' + struct.pack('>H', comment_length) + comment_bytes

    # Insert COM marker right after SOI marker (bytes 0..2)
    modified_data = data[:2] + com_marker + data[2:]

    with open(output_jpg_path, 'wb') as f:
        f.write(modified_data)

    print(f"[SUCCESS] Embedded 145Hz Steganographic Metadata into: {output_jpg_path}")

if __name__ == "__main__":
    tools_dir = pathlib.Path(__file__).parent
    wav_path = tools_dir / "145hz_carrier.wav"
    generate_145hz_tone(wav_path)

    if len(sys.argv) > 1:
        jpg_in = sys.argv[1]
        jpg_out = sys.argv[2] if len(sys.argv) > 2 else jpg_in
        metadata = (
            "Resonance: 145Hz Carrier Frequency (Tartini Difference Tone) | "
            "H_s: 0.62 | Tiphareth-Malkuth Gate | RSF-Observer-7p4"
        )
        embed_metadata(jpg_in, jpg_out, metadata)
