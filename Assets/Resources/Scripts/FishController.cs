using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FishController : MonoBehaviour
{
    [Header("Fish Settings")]
    public int fishID = 0;
    public enum FishSize { Small, Medium, Large }
    public FishSize fishSize = FishSize.Small;

    // Public variables for adjusting behavior
    [Header("Movement Settings")]
    public float moveSpeed = 3f;
    [Range(0.1f, 5f)]
    public float turnRate = 1f;  // Lower value = more gradual turns
    public float maxTurnAngle = 30f;  // Maximum angle change per second
    public float directionChangeInterval = 2f;
    
    [Header("Screen Boundaries")]
    public float screenBuffer = 0.1f; // Buffer for when to wrap around
    public float edgeAvoidDistance = 0.2f; // Distance from edge to start turning away
    public float edgeAvoidStrength = 2f; // How strongly to avoid edges
    
    // Private variables
    private Camera mainCamera;
    private Vector2 currentVelocity;
    private Vector2 targetVelocity;
    private float timeSinceLastDirectionChange = 0f;
    
    private void Start()
    {
        mainCamera = Camera.main;
        
        // Initialize with movement to the right
        currentVelocity = transform.right * moveSpeed;
        ChooseNewDirection();
    }
    
    private void Update()
    {
        // Update timer
        timeSinceLastDirectionChange += Time.deltaTime;
        
        // Periodically change direction
        if (timeSinceLastDirectionChange >= directionChangeInterval)
        {
            ChooseNewDirection();
            timeSinceLastDirectionChange = 0f;
        }
        
        // Add edge avoidance behavior
        Vector2 avoidanceForce = CalculateEdgeAvoidance();
        targetVelocity += avoidanceForce;
        
        // Smoothly steer towards the target velocity
        currentVelocity = Vector2.Lerp(currentVelocity, targetVelocity, turnRate * Time.deltaTime);
        
        // Normalize and apply speed
        currentVelocity = currentVelocity.normalized * moveSpeed;
        
        // Calculate rotation from velocity
        if (currentVelocity.sqrMagnitude > 0.1f)
        {
            float targetAngle = Mathf.Atan2(currentVelocity.y, currentVelocity.x) * Mathf.Rad2Deg;
            float currentAngle = transform.eulerAngles.z;
            
            // Smooth rotation with clamped angle change
            float angleChange = Mathf.DeltaAngle(currentAngle, targetAngle);
            angleChange = Mathf.Clamp(angleChange, -maxTurnAngle * Time.deltaTime, maxTurnAngle * Time.deltaTime);
            float newAngle = currentAngle + angleChange;
            
            transform.rotation = Quaternion.Euler(0, 0, newAngle);
        }
        
        // Move the fish
        transform.position += new Vector3(currentVelocity.x, currentVelocity.y, 0) * Time.deltaTime;
        
        // Check if fish has gone off screen and wrap around
        WrapAroundScreen();
    }
    
    private void ChooseNewDirection()
    {
        // Random angle in radians
        float angle = Random.Range(0f, Mathf.PI * 2f);
        Vector2 newDirection = new Vector2(Mathf.Cos(angle), Mathf.Sin(angle));
        
        // Set new target velocity while preserving speed
        targetVelocity = newDirection * moveSpeed;
    }
    
    private Vector2 CalculateEdgeAvoidance()
    {
        Vector2 avoidanceForce = Vector2.zero;
        
        if (!mainCamera)
            return avoidanceForce;
            
        Vector3 viewportPosition = mainCamera.WorldToViewportPoint(transform.position);
        
        // Calculate forces to avoid each edge
        if (viewportPosition.x < edgeAvoidDistance)
        {
            avoidanceForce.x += edgeAvoidStrength * (edgeAvoidDistance - viewportPosition.x);
        }
        else if (viewportPosition.x > 1f - edgeAvoidDistance)
        {
            avoidanceForce.x -= edgeAvoidStrength * (viewportPosition.x - (1f - edgeAvoidDistance));
        }
        
        if (viewportPosition.y < edgeAvoidDistance)
        {
            avoidanceForce.y += edgeAvoidStrength * (edgeAvoidDistance - viewportPosition.y);
        }
        else if (viewportPosition.y > 1f - edgeAvoidDistance)
        {
            avoidanceForce.y -= edgeAvoidStrength * (viewportPosition.y - (1f - edgeAvoidDistance));
        }
        
        return avoidanceForce;
    }
    
    private void WrapAroundScreen()
    {
        if (!mainCamera)
            return;
            
        Vector3 viewportPosition = mainCamera.WorldToViewportPoint(transform.position);
        bool needsWrapping = false;
        
        // Check horizontal bounds
        if (viewportPosition.x < -screenBuffer)
        {
            viewportPosition.x = 1f + screenBuffer;
            needsWrapping = true;
        }
        else if (viewportPosition.x > 1f + screenBuffer)
        {
            viewportPosition.x = -screenBuffer;
            needsWrapping = true;
        }
        
        // Check vertical bounds
        if (viewportPosition.y < -screenBuffer)
        {
            viewportPosition.y = 1f + screenBuffer;
            needsWrapping = true;
        }
        else if (viewportPosition.y > 1f + screenBuffer)
        {
            viewportPosition.y = -screenBuffer;
            needsWrapping = true;
        }
        
        // Apply wrapping if needed
        if (needsWrapping)
        {
            transform.position = mainCamera.ViewportToWorldPoint(viewportPosition);
        }
    }

    public void CatchFish()
    {
        // Add points to the player's score
        // GameManager.Instance.AddPoints(fishPoints);
        
        // Play a sound effect
        // if (GetComponent<AudioSource>())
        //     GetComponent<AudioSource>().Play();
        
        // Destroy the fish
        Destroy(gameObject);
    }
}